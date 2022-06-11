import React from 'react';
import { useDispatch } from 'react-redux';
import { Input } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';

import { translationsType } from '../../types';
import { filterChangeAction } from '../../actions';
import styles from '../../styles.scss?module';

function Text({ translations, index, value }) {
  const dispatch = useDispatch();

  return (
    <Input
      className={`${styles.mobileField} mini`}
      value={value ?? ''}
      placeholder={translations.value}
      onChange={(e, { value }) =>
        dispatch(filterChangeAction(index, 'value', value))
      }
    />
  );
}

Text.propTypes = {
  translations: translationsType.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.string,
};
Text.defaultTypes = {
  value: '',
};

export default Text;
