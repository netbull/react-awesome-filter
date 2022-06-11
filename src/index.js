import React, { useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Segment, Message, Grid } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';

import store from './store';
import { iconsType, translationsType} from './types';
import { loadAction } from './actions';

Object.filter = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(predicate));

import Filters from './Filters';
import Sorting from './Sorting';
import Actionbar from './Actionbar';

export function AwesomeFilter({ leftButtons, onFilter, onCancel, icons, translations }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => ({
    loading: state.af.loading,
    error: state.af.error,
  }));

  useEffect(() => {
    dispatch(loadAction());
  }, []);

  return (
    <>
      <Segment loading={loading} attached="top">
        {error && <Message negative content={error} />}

        <Grid columns="equal" stackable>
          <Filters translations={translations} />
          <Sorting translations={translations} />
        </Grid>
      </Segment>

      <Actionbar
        leftButtons={leftButtons}
        onFilter={onFilter}
        onCancel={onCancel}
				icons={icons}
				translations={translations}
      />
    </>
  );
}

const propTypes = {
	leftButtons: PropTypes.func,
	onFilter: PropTypes.func,
	onCancel: PropTypes.func,
	icons: iconsType,
	translations: translationsType,
};
const defaultProps = {
	leftButtons: null,
	onFilter: null,
	onCancel: null,
	icons: {
		filterButtonIcon: 'filter',
	},
	translations: {
		filterButtonLabel: 'Filter',
		filterHeading: 'Filter by',
		fieldPlaceholder: 'Select field',
		sortingHeading: 'Sort by',
		and: 'and',
		then_by: 'then by',
		clear: 'Clear',
		cancel: 'Cancel',
		yes: 'Yes',
		no: 'No',
		value: 'Value',
	},
};

AwesomeFilter.propTypes = propTypes;
AwesomeFilter.defaultProps = defaultProps;

function AwesomeFilterWithStore(props) {
  return (
    <Provider store={store()}>
      <AwesomeFilter {...props} />
    </Provider>
  );
}

AwesomeFilterWithStore.propTypes = propTypes;
AwesomeFilterWithStore.defaultProps = defaultProps;

export default AwesomeFilterWithStore;
