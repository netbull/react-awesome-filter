import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select as SemanticSelect } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import styles from '../../styles.scss?module';

import { translationsType } from '../../types';
import { filterChangeAction } from '../../actions';

function Select({ translations, index, value, optionName, multiselect }) {
  const dispatch = useDispatch();
  const options = useSelector(state => state.af.options[optionName] || []);

  return (
    <SemanticSelect
      className={`${styles.mobileField} mini`}
      options={options}
      data-react
      search
      multiple={multiselect}
      value={value}
      placeholder={translations.value}
      selectOnBlur={false}
      onChange={(e, { value }) =>
        dispatch(filterChangeAction(index, 'value', value))
      }
    />
  );
}

Select.propTypes = {
  translations: translationsType.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  optionName: PropTypes.string.isRequired,
  multiselect: PropTypes.bool,
};
Select.defaultProps = {
  multiselect: false,
};

export default Select;
