import * as PropTypes from 'prop-types';
import operators from './constants/operators';

const operatorValues = Object.values(operators).map(operator => operator.value);

export const iconsType = PropTypes.shape({
	filterButtonIcon: PropTypes.string.isRequired,
});

export const translationsType = PropTypes.shape({
	filterButtonLabel: PropTypes.string.isRequired,
	filterHeading: PropTypes.string.isRequired,
	fieldPlaceholder: PropTypes.string.isRequired,
	sortingHeading: PropTypes.string.isRequired,
	and: PropTypes.string.isRequired,
	then_by: PropTypes.string.isRequired,
	clear: PropTypes.string.isRequired,
	cancel: PropTypes.string.isRequired,
	yes: PropTypes.string.isRequired,
	no: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
});

export const filterType = PropTypes.shape({
  field: PropTypes.string.isRequired,
  operator: PropTypes.oneOf(operatorValues).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.string),
  ]),
});

export const filtersType = PropTypes.arrayOf(filterType);

export const sortType = PropTypes.shape({
  field: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
});

export const sortingType = PropTypes.arrayOf(sortType);
