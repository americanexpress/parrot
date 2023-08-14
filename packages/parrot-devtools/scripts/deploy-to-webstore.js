const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const webstoreClient = require('chrome-webstore-upload');

const parrotPath = path.join(__dirname, '..', 'parrot-devtools-extension.zip');
const parrotZipFile = fs.createReadStream(parrotPath);
const target = 'default'; // optional. Can also be 'trustedTesters'

const webStore = webstoreClient({
  extensionId: process.env.CHROME_WEBSTORE_PARROT_DEVTOOLS_APP_ID,
  clientId: process.env.CHROME_WEBSTORE_CLIENT_ID,
  clientSecret: process.env.CHROME_WEBSTORE_CLIENT_SECRET,
  refreshToken: process.env.CHROME_WEBSTORE_REFRESH_TOKEN,
});

webStore
  .fetchToken()
  .then(token => {
    webStore
      .uploadExisting(parrotZipFile, token)
      .then(uploadResponse => {
        // Response is a Resource Representation
        // https://developer.chrome.com/webstore/webstore_api/items#resource
        console.log(uploadResponse);

        webStore
          .publish(target, token)
          .then(publishResponse => {
            // Response is documented here:
            // https://developer.chrome.com/webstore/webstore_api/items/publish
            console.log(publishResponse);
          })
          .catch(publishError =>
            console.error(`There was an issue publishing the extension: ${publishError}`)
          );
      })
      .catch(uploadError =>
        console.error(`There was an issue uploading the zip file: ${uploadError}`)
      );
  })
  .catch(fetchTokenError =>
    console.error(`There was an issue fetching the token: ${fetchTokenError}`)
  );
