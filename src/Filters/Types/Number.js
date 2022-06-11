import React from 'react';
import { useDispatch } from 'react-redux';
import { Input } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';

import { translationsType } from '../../types';
import { filterChangeAction } from '../../actions';
import styles from '../../styles.scss?module';

function Number({ translations, index, value }) {
  const dispatch = useDispatch();

  // TODO: implement between
  return (
    <Input
      type="number"
      className={`${styles.mobileField} mini`}
      value={value ?? 1}
      placeholder={translations.value}
      onChange={(e, { value }) => {
        if (value > 0) {
          dispatch(filterChangeAction(index, 'value', parseInt(value)));
        }
      }}
    />
  );
}

Number.propTypes = {
	translations: translationsType.isRequired,
  value: PropTypes.number,
};
Number.defaultTypes = {
  value: null,
};

export default Number;
