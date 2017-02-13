import React, { PropTypes } from 'react';
import { trigger } from 'redial';
import { connect } from 'react-redux';
import { Dropdown } from 'axp-base';
import { UPDATE_LOCALE } from 'axp-global-ducks';

export const LocaleSelector = props => {
  const changeLocale = ({ value }) => {
    props.updateLocale(props.component, value);
  };
  const options = props.availableLocales.map(locale => {
    return {
      value: locale,
      label: locale
    };
  });
  return (
    <Dropdown
      id="localeDropdown"
      options={options}
      onChange={changeLocale}
      value={props.activeLocale}
      title="Choose a locale"
      label="Choose a locale"
    />
  );
};

LocaleSelector.propTypes = {
  activeLocale: PropTypes.string,
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func
  ]).isRequired,
  defaultLocale: PropTypes.string
};

LocaleSelector.defaultProps = {
  activeLocale: 'N/A',
  availableLocales: ['en-US', 'en-NZ']
};

export function mapStateToProps(state) {
  return {
    activeLocale: state.intl.get('activeLocale')
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    updateLocale: (component, locale) => {
      trigger('lang', component, { dispatch, locale }).then(() => {
        dispatch({
          type: 'global/intl/UPDATE_LOCALE',
          locale
        })
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocaleSelector)
