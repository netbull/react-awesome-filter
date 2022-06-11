import React from 'react';
import { useDispatch } from 'react-redux';
import {
  DateRangePicker,
  SingleDatePicker,
} from 'semantic-ui-react-date-picker';
import * as PropTypes from 'prop-types';
import styles from '../../styles.scss?module';

import { filterChangeAction } from '../../actions';

function Date({ index, value, operator }) {
  const dispatch = useDispatch();

  if (operator === 'is_between') {
    const dates = value.split('|');
    return (
      <div className={styles.mobileField}>
        <DateRangePicker
          className={styles.mobileField}
          selection
          allowSingleDay={false}
          triggerSize="mini"
          startDate={dates.length === 2 ? dates[0] : null}
          endDate={dates.length === 2 ? dates[1] : null}
          onChange={(startDate, endDate) =>
            dispatch(
              filterChangeAction(index, 'value', `${startDate}|${endDate}`)
            )
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.mobileField}>
      <SingleDatePicker
        triggerSize="mini"
        selection
        date={value}
        onChange={date => dispatch(filterChangeAction(index, 'value', date))}
      />
    </div>
  );
}

Date.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  operator: PropTypes.string.isRequired,
};

export default Date;
