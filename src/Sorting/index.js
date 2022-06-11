import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Header, List, Select, Grid } from 'semantic-ui-react';

import { translationsType } from '../types';
import { sortingAddAction } from '../actions';
import SortingRow from './SortingRow';

function findAvailableFields(fields, usedSorting, sort) {
  const output = {};
  Object.keys(fields)
    .filter(field => {
      return (
        fields[field].sortable &&
        (field === sort.field || usedSorting.indexOf(field) === -1)
      );
    })
    .forEach(field => {
      output[field] = fields[field];
    });

  return output;
}

function Sorting({ translations }) {
  const dispatch = useDispatch();
  const { fields, sorting, hasSorting } = useSelector(state => ({
    fields: state.af.fields,
    sorting: state.af.sorting,
    hasSorting:
      Object.values(state.af.fields).filter(option => option.sortable).length >
      0,
  }));

  if (!hasSorting) {
    return null;
  }

  const sortingCount = sorting.length;
  const usedSorting = sorting.map(sort => sort.field);

  return (
    <Grid.Column>
      <Header as="h4" content={translations.sortingHeading} />
      <List className="ui form">
        {sorting.length === 0 && (
          <List.Item>
            <Select
              className="mini"
              style={{ marginRight: 10 }}
              data-react
              options={Object.keys(
                findAvailableFields(fields, usedSorting, '')
              ).map(field => ({
                key: field,
                value: field,
                text: fields[field].label,
              }))}
              placeholder={translations.fieldPlaceholder}
              selectOnBlur={false}
              search
              onChange={(e, { value }) => dispatch(sortingAddAction(value))}
            />
          </List.Item>
        )}
        {sorting.map((sort, i) => {
          return (
            <SortingRow
              key={`sorting-${i}`}
							translations={translations}
              index={i}
              sort={sort}
              availableFields={findAvailableFields(fields, usedSorting, sort)}
              addSuffix={i < sortingCount - 1}
            />
          );
        })}
      </List>
    </Grid.Column>
  );
}

Sorting.propTypes = {
	translations: translationsType.isRequired,
};

export default Sorting;
