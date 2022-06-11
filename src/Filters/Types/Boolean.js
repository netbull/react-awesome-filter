import React from 'react';
import { useDispatch } from 'react-redux';
import { Select as SemanticSelect } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import styles from '../../styles.scss?module';

import { translationsType } from '../../types';
import { filterChangeAction } from '../../actions';

function Boolean({ translations, index, value }) {
  const dispatch = useDispatch();

  return (
    <SemanticSelect
      className={`${styles.mobileField} mini`}
      options={[
        { key: 'yes', value: true, text: translations.yes },
        { key: 'no', value: false, text: translations.yes },
      ]}
      data-react
      search
      value={value}
      placeholder="Value"
      selectOnBlur={false}
      onChange={(e, { value }) =>
        dispatch(filterChangeAction(index, 'value', value))
      }
    />
  );
}

Boolean.propTypes = {
  translations: translationsType.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};

export default Boolean;
