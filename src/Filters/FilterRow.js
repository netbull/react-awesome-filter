import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select, Form, List, Button } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import styles from '../styles.scss?module';

import {
  filterAddAction,
  filterRemoveAction,
  filterChangeAction,
} from '../actions';
import ValueType from './Types';
import { filterType, translationsType } from '../types';

function FilterRow({ translations, index, filter, isFirstUsage, addSuffix }) {
  const dispatch = useDispatch();
  const { fields, fieldUsages } = useSelector(state => ({
    fields: Object.filter(
      state.af.fields,
      ([, options]) =>
        typeof options.filterable === 'undefined' || options.filterable
    ),
    fieldUsages: state.af.filters.filter(f => f.field === filter.field).length,
  }));

  const availableFields = {};
  Object.keys(fields).forEach(field => {
    if (typeof field.filterable !== 'undefined' && !field.filterable) {
      return;
    }
    if (filter.field === field || fields[field].available) {
      availableFields[field] = fields[field];
    }
  });
  const fieldOptions = fields[filter.field];

  let canRemove = !fieldOptions.required;
  if (!canRemove && fieldOptions.multiple && fieldUsages > 1 && !isFirstUsage) {
    canRemove = true;
  }

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
          value={filter.field}
          placeholder="Field"
          selectOnBlur={false}
          disabled={!canRemove}
          onChange={(e, { value }) =>
            dispatch(filterChangeAction(index, 'field', value))
          }
        />
        <Select
          className={`${styles.mobileField} ${styles['mr-10']} mini`}
          data-react
          options={fieldOptions.operators.map(operator => ({
            key: operator.value,
            value: operator.value,
            text: operator.label,
          }))}
          value={filter.operator}
          placeholder="operator"
          selectOnBlur={false}
          onChange={(e, { value }) =>
            dispatch(filterChangeAction(index, 'operator', value))
          }
        />
        {filter.operator !== 'is_empty' && (
          <ValueType
						translations={translations}
            type={fieldOptions.type}
            index={index}
            optionName={fieldOptions.optionName}
            operator={filter.operator}
            value={filter.value}
            multiselect={fieldOptions.multiselect}
          />
        )}
        {canRemove && (
          <Button
            className={styles.buttonM10}
            type="button"
            icon="minus"
            size="mini"
            basic
            color="red"
            onClick={() => dispatch(filterRemoveAction(index))}
          />
        )}
        <Button
          className={styles.buttonM5}
          type="button"
          icon="plus"
          size="mini"
          basic
          color="teal"
          onClick={() => dispatch(filterAddAction())}
        />

        {addSuffix && (
          <label className={`${styles.label} ${styles.labelMobile}`}>{translations.and}</label>
        )}
      </Form.Group>
    </List.Item>
  );
}

FilterRow.propTypes = {
  translations: translationsType.isRequired,
  index: PropTypes.number.isRequired,
  filter: filterType,
  isFirstUsage: PropTypes.bool.isRequired,
  addSuffix: PropTypes.bool.isRequired,
};

export default FilterRow;
