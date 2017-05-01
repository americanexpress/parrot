import bodyParser from 'body-parser';
import mkdirp from 'mkdirp';
import path from 'path';
import promisify from 'promisify-node';
import shortid from 'shortid';
import registerMiddleware from 'parrot-registry';
import writeFile from './writeFile';
import writeScenarioFile from './writeScenarioFile';

const fs = promisify('fs');

const parrotListener = ({
  output = '',
  matcher = () => true,
  name,
  parser = req => req,
  listening = false,
  logger = console.log,
}) => {
  let routes = [];
  let scenarioName = name;
  let isListening = listening;

  const startListening = (name) => {
    scenarioName = name;
    isListening = true;
  }

  const stopListening = () => {
    isListening = false;
    return writeScenarioFile(scenarioName, routes, output)
      .then(() => { routes = []; })
      .catch(logger);
  };

  const middleware = (req, res, next) => {
    if (matcher(req)) {
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
            const outputPath = path.join(__dirname, output, scenarioName, filename);
            const body = Buffer.concat(chunks).toString('utf8');

            return writeFile(outputPath, body)
              .then(() => {
                logger(`Created file for response.
                  request: ${req.path},
                  location: ${outputPath}
                `);
              })
              .then(() => {
                routes.unshift({
                  request: parser(req),
                  response: `./${scenarioName}/${filename}`,
                });
              })
              .catch((e) => {
                logger(`ERROR: Unable to write parrot-listener scenario file: ${e}\n`)
              });
          }
        } catch (e) {
          logger(`ERROR: Error in parrot-listener middleware: ${e.stack}`);
        }
      });

      const killListener = () => {
        if (isListening) {
          stopListening();
        }
      };
      process.on('exit', killListener);
      process.on('SIGINT', killListener);
    }
    next();
  };

  return (app) => {
    app.use(bodyParser.json());
    app.get('/parrot/listen', (req, res) => {
      const config = isListening ? { isListening, scenarioName } : { isListening };
      res.json(config);
    });

    app.put('/parrot/listen', (req, res) => {
      if (req.body.action === 'START') {
        if (isListening === true) {
          return res.status(500).json({
            reason: 'Already listening!'
          });
        } else if (!req.body.scenarioName) {
          return res.status(500).json({
            reason: 'Missing request field: "scenarioName"'
          });
        }
        startListening(req.body.scenarioName);
        return res.status(200).send();
      } else if (req.body.action === 'STOP') {
        return stopListening().then(() =>
          res.status(200).send()
        );
      } else {
        return res.status(500).json({
          reason: 'Unknown or missing action. Valid actions are: START, STOP'
        });
      }
    });
    app.use(middleware.bind(this));
    registerMiddleware(app, { name: 'parrot-listener' });
  };
}

export default parrotListener;
