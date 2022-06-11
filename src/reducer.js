import update from 'immutability-helper';
import qs from 'query-string';
import { Base64 } from 'js-base64';
import { TIME_FORMAT, DATE_FORMAT_NORMAL, getNow } from './utils/date';

import OPERATORS from './constants/operators';
import {
  ACTION_LOADING,
  ACTION_LOADING_SUCCESS,
  ACTION_LOADING_ERROR,
  ACTION_FILTER_ADD,
  ACTION_FILTER_REMOVE,
  ACTION_FILTER_CHANGE_VALUE,
  ACTION_SORTING_ADD,
  ACTION_SORTING_REMOVE,
  ACTION_SORTING_CHANGE_VALUE,
  ACTION_CLEAR,
  ACTION_RESET,
  ACTION_LOAD_FILTERS_AND_SORTING,
} from './actions';

function generateFilterRecord(fieldName, fields, filters = [], options = {}) {
  if (!fieldName) {
    const usedFields = filters.map(filter => filter.field);
    const notUsedFields = Object.keys(fields).filter(fieldName => {
      const field = fields[fieldName];
      return (
        usedFields.indexOf(fieldName) === -1 &&
        (typeof field.filterable === 'undefined' || field.filterable)
      );
    });
    fieldName = notUsedFields[0] ?? Object.keys(fields)[0];
  }

  const field = fields[fieldName];
  const defaultOperator = field.operators[0].value;

  let value = '';
  if (
    field.type === 'Select' &&
    options[field.optionName] &&
    options[field.optionName].length > 0
  ) {
    if (options[field.optionName][0].multiselect) {
      value = options[field.optionName][0].value || [];
    } else {
      value = options[field.optionName][0].value || '';
    }
  } else if (field.type === 'Date') {
    value = getDefaultDateValue(defaultOperator);
  } else if (field.type === 'Time') {
    value = getNow().format(TIME_FORMAT);
  } else if (field.type === 'Boolean') {
    value = true;
  } else if (field.type === 'Number') {
    value = 1;
  }

  return {
    field: fieldName,
    operator: defaultOperator,
    value,
  };
}

// SET INITIAL STATE VALUES START
// first try to set them from the query parameter
let params = {};
const query = qs.parse(window.location.search);
if (query.af) {
  try {
    params = JSON.parse(Base64.decode(query.af));
  } catch (e) {
    console.log(e);
  }
}

// find the available fields
let fieldsConfig = window.options ?? {};
if (window.options) {
  fieldsConfig = window.options.fieldsConfig ?? {};
}

// set the default initial state
const INITIAL_STATE = {
  loading: false,
  valid: true,
  dirty: false,
  canClear: false,
  error: null,
  fields: fieldsConfig,
  options: {},
  filters: params.filters || [],
  sorting: params.sorting || [],
};

// set proper default filters if there are required ones
const usedFilters = INITIAL_STATE.filters.map(filter => filter.field);
Object.keys(INITIAL_STATE.fields).forEach(field => {
  const fieldOptions = INITIAL_STATE.fields[field];
  if (
    typeof fieldOptions === 'undefined' ||
    (typeof fieldOptions.filterable !== 'undefined' && !fieldOptions.filterable)
  ) {
    return;
  }

  if (fieldOptions.required && usedFilters.indexOf(field) === -1) {
    INITIAL_STATE.filters.push(
      generateFilterRecord(
        field,
        INITIAL_STATE.fields,
        INITIAL_STATE.filters,
        INITIAL_STATE.options
      )
    );
    if (!fieldOptions.multiple) {
      INITIAL_STATE.fields[field].available = false;
    }
  }
});

// set proper initial tags for canClear and dirty
const hasNotRequiredFilters =
  INITIAL_STATE.filters.filter(filter => {
    return (
      typeof INITIAL_STATE.fields[filter.field] !== 'undefined' &&
      !INITIAL_STATE.fields[filter.field].required
    );
  }).length > 0;

INITIAL_STATE.dirty =
  INITIAL_STATE.filters.length > 0 || INITIAL_STATE.sorting.length > 0;
INITIAL_STATE.canClear =
  (INITIAL_STATE.filters.length > 0 || INITIAL_STATE.sorting.length > 0) &&
  hasNotRequiredFilters;
// SET INITIAL STATE VALUES END

function getDefaultDateValue(operator) {
  const dates = [];
  if (operator === 'is_between') {
    dates.push(getNow().format(DATE_FORMAT_NORMAL));
    dates.push(getNow().add(1, 'day').format(DATE_FORMAT_NORMAL));
  } else {
    dates.push(getNow().format(DATE_FORMAT_NORMAL));
  }

  return dates.join('|');
}
function validateFilters(filters) {
  let valid = true;
  for (let i = 0; i < filters.length; i++) {
    if (filters[i].value === '') {
      valid = false;
      break;
    }
  }

  return valid;
}
export default function reducer(state = INITIAL_STATE, action) {
  let newState = { ...state };
  switch (action.type) {
    case ACTION_LOADING: {
      newState = update(newState, {
        loading: {
          $set: action.payload,
        },
      });
      break;
    }
    case ACTION_LOADING_SUCCESS: {
      newState = update(newState, {
        options: {
          $set: action.payload,
        },
        loading: {
          $set: false,
        },
      });
      break;
    }
    case ACTION_LOADING_ERROR: {
      newState = update(newState, {
        error: {
          $set: action.payload,
        },
        loading: {
          $set: false,
        },
      });
      break;
    }
    case ACTION_FILTER_ADD: {
      const { field, operator, value } = generateFilterRecord(
        action.payload,
        newState.fields,
        newState.filters,
        newState.options
      );
      const fieldOptions = newState.fields[field];

      const changeSet = {
        filters: {
          $push: [{ field, operator, value }],
        },
      };
      if (!fieldOptions.multiple) {
        changeSet.fields = {
          [field]: {
            available: {
              $set: false,
            },
          },
        };
      }
      newState = update(newState, changeSet);
      newState = update(newState, {
        valid: {
          $set: validateFilters(newState.filters),
        },
      });
      break;
    }
    case ACTION_FILTER_REMOVE: {
      const fieldName = newState.filters[action.payload].field;
      const fieldOptions = newState.fields[fieldName];

      const changeSet = {
        filters: {
          $splice: [[action.payload, 1]],
        },
      };
      if (!fieldOptions.available) {
        changeSet.fields = {
          [fieldName]: {
            available: {
              $set: true,
            },
          },
        };
      }
      newState = update(newState, changeSet);
      newState = update(newState, {
        valid: {
          $set: validateFilters(newState.filters),
        },
      });
      break;
    }
    case ACTION_FILTER_CHANGE_VALUE: {
      const { index, name } = action.payload;
      let { value } = action.payload;

      const changeSet = {
        filters: {
          [index]: {
            [name]: {
              $set: value,
            },
          },
        },
      };
      if (name === 'field') {
        let v = '';
        const field = newState.fields[value];
        const defaultOperator = field.operators[0].value;
        if (
          field.type === 'Select' &&
          newState.options[field.optionName] &&
          newState.options[field.optionName].length > 0
        ) {
          if (newState.options[field.optionName][0].multiselect) {
            v = newState.options[field.optionName][0].value || [];
          } else {
            v = newState.options[field.optionName][0].value || '';
          }
        } else if (field.type === 'Date') {
          v = getDefaultDateValue(defaultOperator);
        }
        changeSet.filters[index].operator = { $set: defaultOperator };
        changeSet.filters[index].value = { $set: v };
      }
      if (name === 'operator') {
        let v = '';
        const oldOperator = newState.filters[index].operator;
        const fieldName = newState.filters[index].field;
        const field = newState.fields[fieldName];

        const specialInOperators = [
          OPERATORS.OPERATOR_IS_IN.value,
          OPERATORS.OPERATOR_IS_NOT_IN.value,
        ];
        if (
          typeof field.optionName !== 'undefined' &&
          oldOperator !== value &&
          (specialInOperators.indexOf(oldOperator) > -1 ||
            specialInOperators.indexOf(value) > -1)
        ) {
          if (field.multiselect) {
            v = [];
          } else {
            v = '';
          }
          changeSet.filters[index].value = { $set: v };
        }

        if (
          field.type === 'Date' &&
          (oldOperator === OPERATORS.OPERATOR_IS_BETWEEN.value ||
            value === OPERATORS.OPERATOR_IS_BETWEEN.value)
        ) {
          value = getDefaultDateValue(value);
          changeSet.filters[index].value = { $set: value };
        }

        if (value === OPERATORS.OPERATOR_IS_EMPTY.value) {
          changeSet.filters[index].value = { $set: null };
        }
      }
      newState = update(newState, changeSet);
      newState = update(newState, {
        valid: {
          $set: validateFilters(newState.filters),
        },
      });
      break;
    }
    case ACTION_SORTING_ADD: {
      let fieldName;
      if (action.payload) {
        fieldName = action.payload;
      } else {
        const usedFields = newState.sorting.map(sort => sort.field);
        const notUsedFields = Object.keys(newState.fields).filter(fieldName => {
          const field = newState.fields[fieldName];
          return (
            usedFields.indexOf(fieldName) === -1 &&
            (typeof field.sortable === 'undefined' || field.sortable)
          );
        });
        fieldName = notUsedFields[0] ?? Object.keys(newState.fields)[0];
      }

      newState = update(newState, {
        sorting: {
          $push: [
            {
              field: fieldName,
              direction: 'asc',
            },
          ],
        },
      });
      break;
    }
    case ACTION_SORTING_REMOVE: {
      newState = update(newState, {
        sorting: {
          $splice: [[action.payload, 1]],
        },
      });
      break;
    }
    case ACTION_SORTING_CHANGE_VALUE: {
      const { index, name, value } = action.payload;

      const changeSet = {
        sorting: {
          [index]: {
            [name]: {
              $set: value,
            },
          },
        },
      };
      if (name === 'field') {
        changeSet.sorting[index].direction = {
          $set: 'asc',
        };
      }
      newState = update(newState, changeSet);
      break;
    }
    case ACTION_CLEAR: {
      newState = update(newState, {
        filters: {
          $set: [],
        },
        sorting: {
          $set: [],
        },
      });
      break;
    }
    case ACTION_RESET: {
      newState = update(newState, {
        filters: {
          $set: [...INITIAL_STATE.filters],
        },
        sorting: {
          $set: [...INITIAL_STATE.sorting],
        },
      });
      break;
    }
    case ACTION_LOAD_FILTERS_AND_SORTING: {
      newState = update(newState, {
        dirty: {
          $set: true,
        },
        filters: {
          $set: [...action.payload.filters],
        },
        sorting: {
          $set: [...action.payload.sorting],
        },
      });
      break;
    }
  }

  newState.dirty =
    JSON.stringify(newState.filters) !==
      JSON.stringify(INITIAL_STATE.filters) ||
    JSON.stringify(newState.sorting) !== JSON.stringify(INITIAL_STATE.sorting);
  return newState;
}
