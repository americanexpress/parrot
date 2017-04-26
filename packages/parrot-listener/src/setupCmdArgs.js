const setupCmdArgs = (yargs) =>
  yargs
  .option('l', {
     alias: 'listen',
     describe: 'Listen to incoming requests and generate scenarios',
     type: 'boolean',
   })
   .option('n', {
     alias: 'name',
     describe: 'Name for your generated scenario',
     type: 'string',
   });
   // TODO implement overwriting
   /*.option('update', {
     alias: 'u',
     describe: 'Overwrite your scenario if it exists',
     type: 'boolean',
   });*/

export default setupCmdArgs;
