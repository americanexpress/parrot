# Parrot Devtools

## How to install

### Chrome Extension
* Download and unzip the [zipped chrome extension](https://stash.aexp.com/stash/users/jcros8/repos/parrot/browse/packages/parrot-devtools/parrot-devtools-chrome-extension.zip).
* Follow [these instructions](https://developer.chrome.com/extensions/getstarted#unpacked) to install an unpacked chrome extension.
* Navigate to the `Parrot` tab of your devtools panel.

### Standalone

* Download and unzip the [zipped standalone folder](https://stash.aexp.com/stash/users/jcros8/repos/parrot/browse/packages/parrot-devtools/parrot-devtools.zip)
* Open `index.html` in any browser.
* Enter the Scenarios Host URL of the server that Parrot middleware is running on.
* **Note:** In order to use the devtools, you ***must*** import and enable CORS middleware on the server that Parrot middleware is running on

## Developing
Want to contribute to the devtools?  Great!  Here are a couple things you should know.

### Repo Structure

* `/src`
  * `/app`: React components used across all extensions and standalone devtools.
  * `/assets`: Images such as the devtools logo.
  * `/browser`: Any extension-related code that is not easily shared throughout the devtools app.
