import axios from 'axios';
import { Base64 } from 'js-base64';

export const ACTION_LOADING = 'af.loading';
export const ACTION_LOADING_SUCCESS = 'af.loading.success';
export const ACTION_LOADING_ERROR = 'af.loading.error';
export const ACTION_FILTER_ADD = 'af.filter.add';
export const ACTION_FILTER_REMOVE = 'af.filter.remove';
export const ACTION_FILTER_CHANGE_VALUE = 'af.filter.change.value';
export const ACTION_SORTING_ADD = 'af.sorting.add';
export const ACTION_SORTING_REMOVE = 'af.sorting.remove';
export const ACTION_SORTING_CHANGE_VALUE = 'af.sorting.change.value';
export const ACTION_CLEAR = 'af.clear';
export const ACTION_RESET = 'af.reset';
export const ACTION_LOAD_FILTERS_AND_SORTING = 'af.load.filters_and_sorting';

function loading(loading) {
  return {
    type: ACTION_LOADING,
    payload: loading,
  };
}

function loadingSuccess(data) {
  return {
    type: ACTION_LOADING_SUCCESS,
    payload: data,
  };
}

function loadingError(error) {
  return {
    type: ACTION_LOADING_ERROR,
    payload: error,
  };
}

export function loadAction() {
  return async function (dispatch) {
    dispatch(loading(true));

    try {
      const { data } = await axios.get(
        `${window.location.pathname}/awesome-filter-data.json`
      );
      dispatch(loadingSuccess(data));
    } catch ({ response }) {
			dispatch(loading(false));
      // dispatch(loadingError(response.data?.detail ?? 'Error'));
    }
  };
}

export function filterAddAction(field) {
  return {
    type: ACTION_FILTER_ADD,
    payload: field,
  };
}

export function filterRemoveAction(index) {
  return {
    type: ACTION_FILTER_REMOVE,
    payload: index,
  };
}

export function filterChangeAction(index, name, value) {
  return {
    type: ACTION_FILTER_CHANGE_VALUE,
    payload: { index, name, value },
  };
}

export function sortingAddAction(field) {
  return {
    type: ACTION_SORTING_ADD,
    payload: field,
  };
}

export function sortingRemoveAction(index) {
  return {
    type: ACTION_SORTING_REMOVE,
    payload: index,
  };
}

export function sortingChangeAction(index, name, value) {
  return {
    type: ACTION_SORTING_CHANGE_VALUE,
    payload: { index, name, value },
  };
}

export function filterAction() {
  return async function (dispatch, getState) {
    const {
      af: { filters, sorting },
    } = getState();

    const values = { filters, sorting };

    if (Object.keys(values).length > 0) {
      window.location.search = `af=${Base64.encode(JSON.stringify(values))}`;
    }
  };
}

export function clearAction() {
  return async function (dispatch) {
    dispatch({ type: ACTION_CLEAR });

    if (window.location.search !== '') {
      window.location.search = '';
    }
  };
}

export function resetAction() {
  return {
    type: ACTION_RESET,
  };
}

export function loadFiltersAndSortingAction({ filters, sorting }) {
  return {
    type: ACTION_LOAD_FILTERS_AND_SORTING,
    payload: { filters, sorting },
  };
}
