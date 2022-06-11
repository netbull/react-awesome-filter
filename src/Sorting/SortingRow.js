import React from 'react';
import { useDispatch } from 'react-redux';
import { Select, Form, List, Button } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import styles from '../styles.scss?module';

import {
  sortingAddAction,
  sortingRemoveAction,
  sortingChangeAction,
} from '../actions';
import { sortType, translationsType } from '../types';

const DIRECTIONS = [
  { key: 'asc', value: 'asc', text: 'Ascending' },
  { key: 'desc', value: 'desc', text: 'Descending' },
];
function SortingRow({ translations, index, sort, addSuffix, availableFields }) {
  const dispatch = useDispatch();

  return (
    <List.Item className={styles.mobileList}>
      <Form.Group widths="equal" inline className={styles.mobileFields}>
        <Select
          className={`${styles.mobileField} ${styles['mr-10']} mini`}
          data-react
          search
          options={Object.keys(availableFields).map(field => ({
            key: field,
            value: field,
            text: availableFields[field].label,
          }))}
          value={sort.field}
          placeholder="Field"
          selectOnBlur={false}
          onChange={(e, { value }) =>
            dispatch(sortingChangeAction(index, 'field', value))
          }
        />
        <Select
          className={`${styles.mobileField} mini`}
          data-react
          options={DIRECTIONS}
          value={sort.direction}
          placeholder="Direction"
          selectOnBlur={false}
          onChange={(e, { value }) =>
            dispatch(sortingChangeAction(index, 'direction', value))
          }
        />
        <Button
          className={styles.buttonM10}
					type="button"
          icon="minus"
          size="mini"
          basic
          color="red"
          onClick={() => dispatch(sortingRemoveAction(index))}
        />
        <Button
          className={styles.buttonM5}
          type="button"
          icon="plus"
          size="mini"
          basic
          color="teal"
          onClick={() => dispatch(sortingAddAction())}
        />

        {addSuffix && (
          <label className={`${styles.label} ${styles.labelMobile}`}>
						{translations.then_by}
          </label>
        )}
      </Form.Group>
    </List.Item>
  );
}

SortingRow.propTypes = {
  translations: translationsType.isRequired,
  index: PropTypes.number.isRequired,
  sort: sortType,
  addSuffix: PropTypes.bool.isRequired,
  availableFields: PropTypes.object.isRequired,
};

export default SortingRow;
