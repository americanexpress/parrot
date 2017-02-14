# Language Pack Handling

## Setup

```js
// webpack.config.babel.js

// import the createMiddlewareForLanguage middleware
import createMiddlewareForScenario, { createMiddlewareForLanguage } from 'axp-mock-middleware';

module.exports = {
  // ...
  devServer: {
    setup: app => {
      createMiddlewareForScenario(scenarios)(app);
      // Add the new middleware
      createMiddlewareForLanguage()(app);
    },
    historyApiFallback: true
  },
}
```



```js
// index.dev.js

import LocaleSelector from 'axp-mock-middleware/lib/components/LocaleSelector';
import IntlProviderContainer from 'axp-mock-middleware/lib/components/IntlProviderContainer';
// Import the component that has defined the redial lang trigger
import MyComponent from 'src/components/MyComponent';

...
// In your render function add at the top:
<LocaleSelector
  component={MyComponent}
  availableLocales={['de-AT', 'en-US', 'es-ES', 'nl-NL']}
/>

// And wrap your component with an IntlProvider
<Provider store={store}>
  <div>
    <IntlProviderContainer component="axpMyComponent">
      <MyComponent />
    </IntlProviderContainer>
  </div>
</Provider>
```

## createMiddlewareForLanguage

This function looks in the `locale` folder the language pack JSON files.

It supports two folder structures:

```
- locale/
-- en-US.json
-- es-ES.json
```

```
- locale/
-- en-US/
--- copy.json
-- es-ES/
--- copy.json
```

You can also pass the function an options object:

```js
const localeOptions = {
  // Delayed loading
  delay: 2000,
  // Can also specify a non-200 HTTP responseCode
  responseCode: 500
};

createMiddlewareForLanguage(localeOptions)(app);
```



## LocaleSelector

This component dispatches actions to change the locale using the `axp-global-ducks` reducers. 

Requires that you pass:

* the connected component that has defined the redial lang trigger
* array of available locales



## IntlProviderContainer

This component mocks the behavior of the IntlProvider that is wrapped around components in axp-app, it allows your components to receive language pack information via the context.

The `IntlProviderContainer` requires you pass the component language pack key (ex: "axpOffers").

See the axp-app [i18n documentation](https://stash.aexp.com/stash/projects/UIE/repos/axp-app-docs/browse/i18n.md) for more information.
