import React from 'react';
import * as PropTypes from 'prop-types';

import { translationsType } from '../../types';
import OPERATORS from '../../constants/operators';
import Select from './Select';
import Text from './Text';
import Date from './Date';
import Time from './Time';
import Boolean from './Boolean';
import Number from './Number';

function ValueType({ translations, type, ...options }) {
  if (
    typeof options.optionName !== 'undefined' &&
    [
      OPERATORS.OPERATOR_IS_IN.value,
      OPERATORS.OPERATOR_IS_NOT_IN.value,
    ].indexOf(options.operator) > -1
  ) {
    return <Select translations={translations} {...options} />;
  }

  switch (type) {
    case 'Select':
      return <Select translations={translations} {...options} />;
    case 'Text':
      return <Text translations={translations} {...options} />;
    case 'Date':
      return <Date translations={translations} {...options} />;
    case 'Time':
      return <Time translations={translations} {...options} />;
    case 'Boolean':
      return <Boolean translations={translations} {...options} />;
    case 'Number':
      return <Number translations={translations} {...options} />;
    default:
      throw new Error('The value type is not defined');
  }
}

ValueType.propTypes = {
  translations: translationsType.isRequired,
  type: PropTypes.string.isRequired,
};

export default ValueType;
