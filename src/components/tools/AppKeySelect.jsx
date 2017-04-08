import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import { APP_KEY_CATEGORIES, isServiceKeyGenerator } from '../../utils/toolHelpers';

function AppKeySelect({ value, onChange, ariaLabel }) {
  const { t, i18n } = useTranslation();

  const optionGroups = useMemo(
    () =>
      APP_KEY_CATEGORIES.map((group) => ({
        id: group.id,
        label: t(`tools.ui.appKeys.categories.${group.id}`),
        options: group.apps.map((appId) => {
          const isService = isServiceKeyGenerator(appId);

          return {
            id: appId,
            label: isService
              ? `${t(`tools.ui.uuidHash.secretTypes.${appId}`)} (${t(`tools.ui.appKeys.serviceFormats.${appId}`)})`
              : `${t(`tools.ui.appKeys.apps.${appId}.title`)} ${t(`tools.ui.appKeys.apps.${appId}.format`)}`,
          };
        }),
      })),
    [t, i18n.language]
  );

  return (
    <Form.Select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="app-key-select"
      aria-label={ariaLabel}
    >
      {optionGroups.map((group) => (
        <optgroup key={group.id} label={group.label}>
          {group.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </optgroup>
      ))}
    </Form.Select>
  );
}

export default AppKeySelect;
