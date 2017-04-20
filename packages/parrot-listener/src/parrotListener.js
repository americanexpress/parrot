import bodyParser from 'body-parser';
import mkdirp from 'mkdirp';
import path from 'path';
import promisify from 'promisify-node';
import shortid from 'shortid';
import writeFile from './writeFile';
import writeScenarioFile from './writeScenarioFile';

const fs = promisify('fs');

export default class ParrotListener {
  constructor({
    output = '',
    matcher = () => true,
    name,
    parser = req => req,
    listening = false,
    logger = console.log,
  }) {
    this.options = {
      logger,
      output,
      matcher,
      parser,
    };

    this.name = name;
    this.routes = [];
    this.listening = listening;
    return (app) => {
      app.use(bodyParser.json());
      app.get('/parrot/listen', (req, res) => {
        res.json(this.listening);
      });

      app.put('/parrot/listen', (req, res) => {
        if (req.body.action === 'START') {
          if (this.listening === true) {
            return res.status(500).json({
              reason: 'Already listening!'
            });
          } else if (!req.body.name) {
            return res.status(500).json({
              reason: 'Missing request field: "name"'
            });
          }
          this.startListening(req.body.name);
          return res.status(200).send();
        } else if (req.body.action === 'STOP') {
          return this.stopListening().then(() =>
            res.status(200).send()
          );
        } else {
          return res.status(500).json({
            reason: 'Unknown or missing action. Valid actions are: START, STOP'
          });
        }
      });
      app.use(this.middleware.bind(this));
    }
  }

  startListening(name) {
    this.name = name;
    this.listening = true;
  }

  stopListening() {
    this.listening = false;
    return writeScenarioFile(this.name, this.routes, this.options.output).then(() => {
      this.routes = [];
    })
    .catch(e => this.options.logger(e));
  }

  middleware(req, res, next) {
    if (this.options.matcher(req)) {
      res.locals.parrot = {
        id: shortid.generate(),
      };

      const chunks = [];
      const oldWrite = res.write;

      res.write = function (chunk) {
        chunks.push(chunk);
        oldWrite.apply(res, arguments);
      };

      res.on('finish', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const filename = `${res.locals.parrot.id}.json`;
            const outputPath = path.join(__dirname, this.options.output, this.name, filename);
            const body = Buffer.concat(chunks).toString('utf8');

            return writeFile(outputPath, body)
              .then(() => {
                this.options.logger(`Created file for response.
                  request: ${req.path},
                  location: ${outputPath}
                `);
              })
              .then(() => {
                this.routes.unshift({
                  request: this.options.parser(req),
                  response: `./${this.name}/${filename}`,
                });
              })
              .catch((e) => {
                this.options.logger(`ERROR: Unable to write parrot-listener scenario file: ${e}\n`)
              });
          }
        } catch (e) {
          this.options.logger(`ERROR: Error in parrot-listener middleware: ${e.stack}`);
        }
      });

      const killListener = () => {
        if (this.listening) {
          this.stopListening();
        }
      };
      process.on('exit', killListener);
      process.on('SIGINT', killListener);
    }
    next();
  }
};
