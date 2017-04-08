import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CopyButton from '../CopyButton';
import MaterialIcon from '../../common/MaterialIcon';
import { formatColorValues, hexToRgb } from '../../../utils/toolHelpers';
import CustomPaletteList from './CustomPaletteList';

function ColorEyedropperPanel({
  activeColor,
  pickerHex,
  variant = 'default',
  tabbed = false,
  customPalette = [],
  onActiveColorChange,
  onPickerHexChange,
  onStatusChange,
  onAddFavorite,
  onAddToCustomPalette,
  onRemoveCustomColor,
  onClearCustomPalette,
}) {
  const { t } = useTranslation();
  const isSidebar = variant === 'sidebar';

  const handleManualColor = (hexValue) => {
    onPickerHexChange(hexValue);
    try {
      const { r, g, b } = hexToRgb(hexValue);
      const formatted = formatColorValues(r, g, b);
      onActiveColorChange(formatted);
      onStatusChange(t('tools.ui.imageColorStudio.manualSet', { hex: formatted.hex }));
    } catch {
      onStatusChange(t('tools.ui.imageColorStudio.invalidHex'));
    }
  };

  const panelClass = [
    'image-color-eyedropper-panel',
    isSidebar ? 'image-color-eyedropper-panel--sidebar' : '',
    isSidebar && !tabbed ? 'image-color-sidebar-section' : '',
    tabbed ? 'image-color-eyedropper-panel--tabbed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      className={panelClass}
      role={tabbed ? 'tabpanel' : undefined}
      id={tabbed ? 'tool-tabpanel-picker' : undefined}
      aria-labelledby={tabbed ? 'tool-tab-picker' : undefined}
      aria-label={tabbed ? undefined : t('tools.ui.imageColorStudio.sidebarEyedropper')}
    >
      {isSidebar && !tabbed ? (
        <h2 className="h6 fw-bold mb-2">
          <MaterialIcon name="colorize" className="me-2 text-primary" />
          {t('tools.ui.imageColorStudio.sidebarEyedropper')}
        </h2>
      ) : null}

      <div className="image-color-result glass-card">
        <div className="image-color-result-swatch" style={{ backgroundColor: activeColor.hex }} aria-hidden="true" />

        <Form.Group className="mb-3">

          <div className="d-flex align-items-center gap-2">
            <Form.Control
              type="color"
              value={pickerHex}
              onChange={(event) => handleManualColor(event.target.value)}
              className="image-color-native-picker"
              aria-label={t('tools.ui.imageColorStudio.chooseColorAria')}
            />
            <Form.Control
              size={isSidebar ? 'sm' : undefined}
              value={pickerHex}
              onChange={(event) => handleManualColor(event.target.value)}
              className="font-monospace"
              aria-label={t('tools.ui.imageColorStudio.hexValueAria')}
            />
          </div>
        </Form.Group>

        <div className="image-color-value-rows">
          {[
            { label: 'HEX', value: activeColor.hex },
            { label: 'RGB', value: activeColor.rgb },
            { label: 'HSL', value: activeColor.hsl },
          ].map((entry) => (
            <div key={entry.label} className="image-color-value-row">
              <div>
                <span className="small text-secondary d-block">{entry.label}</span>
                <code className="small">{entry.value}</code>
              </div>
              <CopyButton text={entry.value} />
            </div>
          ))}
        </div>

        <div className={`image-color-result-actions${isSidebar ? ' image-color-result-actions--sidebar' : ''}`}>
          <Button variant="outline-primary" size={isSidebar ? 'sm' : undefined} className="rounded-pill" onClick={() => onAddFavorite(activeColor)}>
            <MaterialIcon name="favorite" className="me-2" />
            {t('tools.ui.imageColorStudio.addFavorite')}
          </Button>
          <Button variant="outline-secondary" size={isSidebar ? 'sm' : undefined} className="rounded-pill" onClick={() => onAddToCustomPalette(activeColor)}>
            <MaterialIcon name="add" className="me-2" />
            {t('tools.ui.imageColorStudio.addToPalette')}
          </Button>
        </div>

        <CustomPaletteList
          colors={customPalette}
          activeHex={activeColor.hex}
          onSelect={onActiveColorChange}
          onRemove={onRemoveCustomColor}
          onClear={onClearCustomPalette}
        />
      </div>
    </section>
  );
}

export default ColorEyedropperPanel;
