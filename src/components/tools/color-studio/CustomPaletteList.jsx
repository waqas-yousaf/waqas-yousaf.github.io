import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import MaterialIcon from '../../common/MaterialIcon';

function CustomPaletteList({ colors, activeHex, onSelect, onRemove, onClear }) {
  const { t } = useTranslation();

  if (!colors.length) return null;

  return (
    <div className="image-color-custom-palette-list">
      <div className="image-color-custom-palette-list-header">
        <h3 className="h6 fw-bold mb-0">
          {t('tools.ui.imageColorStudio.customPaletteTitle', { count: colors.length })}
        </h3>
        <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={onClear}>
          {t('tools.ui.imageColorStudio.clearCustomPalette')}
        </Button>
      </div>

      <div className="image-color-custom-palette-chips">
        {colors.map((color) => {
          const isActive = activeHex?.toLowerCase() === color.hex.toLowerCase();

          return (
            <div key={color.hex} className={`image-color-custom-palette-chip${isActive ? ' is-active' : ''}`}>
              <button
                type="button"
                className="image-color-custom-palette-swatch"
                style={{ backgroundColor: color.hex }}
                onClick={() => onSelect(color)}
                aria-label={t('tools.ui.imageColorStudio.selectPaletteColor', { hex: color.hex })}
              />
              <code className="image-color-custom-palette-hex">{color.hex}</code>
              <button
                type="button"
                className="image-color-custom-palette-remove"
                onClick={() => onRemove(color.hex)}
                aria-label={t('tools.ui.imageColorStudio.removeCustomColor', { hex: color.hex })}
              >
                <MaterialIcon name="close" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CustomPaletteList;
