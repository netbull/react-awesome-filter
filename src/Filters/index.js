import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Header, List, Select, Grid } from 'semantic-ui-react';

import { translationsType } from '../types';
import { filterAddAction } from '../actions';
import FilterRow from './FilterRow';

function Filters({ translations }) {
  const dispatch = useDispatch();
  const { fields, filters } = useSelector(state => ({
    fields: Object.filter(
      state.af.fields,
      ([, options]) =>
        typeof options.filterable === 'undefined' || options.filterable
    ),
    filters: state.af.filters,
  }));

  const filtersCount = Object.keys(filters).length;
  const fieldUsages = [];
  return (
    <Grid.Column>
      <Header as="h4" content={translations.filterHeading} />
      <List className="ui form">
        {filters.length === 0 && (
          <List.Item>
            <Select
              className="mini"
              style={{ marginRight: 10 }}
              data-react
              options={Object.keys(fields).map(field => ({
                key: field,
                value: field,
                text: fields[field].label,
              }))}
              placeholder={translations.fieldPlaceholder}
              selectOnBlur={false}
              search
              onChange={(e, { value }) => dispatch(filterAddAction(value))}
            />
          </List.Item>
        )}
        {filters.map((filter, i) => {
          const isFirstUsage = fieldUsages.indexOf(filter.field) === -1;
          fieldUsages.push(filter.field);
          return (
            <FilterRow
              key={`filter-${i}`}
							translations={translations}
              index={i}
              filter={filter}
              isFirstUsage={isFirstUsage}
              addSuffix={i < filtersCount - 1}
            />
          );
        })}
      </List>
    </Grid.Column>
  );
}

Filters.propTypes = {
	translations: translationsType.isRequired,
};

export default Filters;
