import React from 'react';
import { useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import styles from '../../styles.scss?module';

import { TimePicker } from 'semantic-ui-react-date-picker';

import { filterChangeAction } from '../../actions';

function Time({ index, value }) {
  const dispatch = useDispatch();

  return (
    <div className={styles.mobileField}>
      <TimePicker
        value={value}
        size="mini"
        onlyInput
        onChange={value => {
          dispatch(filterChangeAction(index, 'value', value));
        }}
      />
    </div>
  );
}

Time.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
};

export default Time;
