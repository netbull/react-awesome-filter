import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Menu } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';

import { clearAction, filterAction, resetAction } from './actions';
import { iconsType, translationsType } from './types';

function Actionbar({ leftButtons, onFilter, onCancel, icons, translations }) {
  const dispatch = useDispatch();
  const { loading, valid, dirty, canClear, filters, sorting } = useSelector(
    state => ({
      loading: state.af.loading,
      valid: state.af.valid,
      dirty: state.af.dirty,
      canClear: state.af.canClear,
      filters: state.af.filters,
      sorting: state.af.sorting,
    })
  );

  return (
    <Menu attached="bottom">
      <Menu.Item>
        {leftButtons && leftButtons(loading, canClear, valid, filters, sorting)}

        <Button
					type="button"
          primary
          size="mini"
          icon={icons.filterButtonIcon}
          content={translations.filterButtonLabel}
          disabled={loading || !valid || !dirty}
          onClick={async () => {
            if (onFilter) {
              onFilter({ filters, sorting });
            } else {
              dispatch(filterAction());
            }
          }}
        />

        {dirty && (
          <Button
						type="button"
            basic
            size="mini"
            content={translations.cancel}
            primary
            disabled={loading}
            style={{ marginLeft: 10 }}
            onClick={() => {
              dispatch(resetAction());
              if (onCancel) {
                onCancel();
              }
            }}
          />
        )}
      </Menu.Item>
      {canClear && (
        <Menu.Item>
          <Button
            type="button"
            basic
            size="mini"
            content={translations.clear}
            color="orange"
            disabled={loading}
            onClick={() => dispatch(clearAction())}
          />
        </Menu.Item>
      )}
    </Menu>
  );
}

Actionbar.propTypes = {
  leftButtons: PropTypes.func,
  onFilter: PropTypes.func,
  onCancel: PropTypes.func,
	icons: iconsType.isRequired,
	translations: translationsType.isRequired,
};

Actionbar.defaultProps = {
  leftButtons: null,
  onFilter: null,
  onCancel: null,
};

export default Actionbar;
