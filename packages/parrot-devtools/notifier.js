const notifier = require('node-notifier'); // eslint-disable-line import/no-extraneous-dependencies

notifier.notify({
  title: 'Chokidar Build completed!',
  message: 'You can now refresh the browser',
});
