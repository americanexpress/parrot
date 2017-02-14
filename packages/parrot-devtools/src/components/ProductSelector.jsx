import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { selectProduct } from 'axp-api-ducks';
import { Dropdown } from 'axp-base';
import { Map } from 'immutable';

const ProductSelector = ({ products, active, select }) => {
  const dropDownProps = {
    id: 'product-selector',
    options: products,
    title: 'Select a product',
    onChange: select,
    value: active,
    label: 'Select a Product'
  };

  return <Dropdown {...dropDownProps} />;
};

ProductSelector.propTypes = {
  products: PropTypes.array,
  active: PropTypes.string,
  select: PropTypes.func,
  onChange: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const products = Map(state.core.resources.products.get('productsList')).map(product => {
    return {
      text: `${product.account.relationship} - ${product.product.payment_type} - ${product.product.line_of_business_type} - ${product.account_token}`,
      value: product.account_token
    };
  }).toList().toJS();

  
  return {
    products,
    active: state.core.resources.products.get('selectedProduct')
  };
}

function mD2P(dispatch, ownProps) {
  return {
    select: cardId => {
      dispatch(selectProduct(cardId.value))
      ownProps.onChange();
    }
  };
}

export default connect(mapStateToProps, mD2P)(ProductSelector);
