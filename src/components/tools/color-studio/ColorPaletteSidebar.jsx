import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import CopyButton from '../CopyButton';
import MaterialIcon from '../../common/MaterialIcon';
import { useColorPickHandler } from '../../../hooks/useColorPickHandler';
import { PALETTE_MOODS, PALETTE_SIZES, RANDOM_PALETTE_STYLES, buildCssVariables } from '../../../utils/colorStudio';

function ColorPaletteSidebar({
  imageLoaded,
  paletteSize,
  paletteMood,
  extractedPalette,
  displayPalette,
  randomPaletteSize,
  randomPaletteStyle,
  tabbed = false,
  onPaletteSizeChange,
  onPaletteMoodChange,
  onRandomSizeChange,
  onRandomStyleChange,
  onGenerateRandom,
  onSelectColor,
  onContrastForegroundChange,
}) {
  const { t } = useTranslation();
  const getColorPickHandlers = useColorPickHandler(onSelectColor, onContrastForegroundChange);

  const totalWeight = displayPalette.reduce((sum, color) => sum + (color.weight || 1), 0) || 1;
  const hexList = displayPalette.map((color) => color.hex).join(', ');
  const cssVariables = buildCssVariables(displayPalette);

  const panelClass = [
    'image-color-palette-sidebar',
    tabbed ? 'image-color-palette-sidebar--tabbed' : 'image-color-sidebar-section',
  ].join(' ');

  return (
    <section
      className={panelClass}
      role={tabbed ? 'tabpanel' : undefined}
      id={tabbed ? 'tool-tabpanel-palette' : undefined}
      aria-labelledby={tabbed ? 'tool-tab-palette' : undefined}
      aria-label={tabbed ? undefined : t('tools.ui.imageColorStudio.sidebarPalette')}
    >
      {!tabbed ? (
        <h2 className="h6 fw-bold mb-3">
          <MaterialIcon name="gradient" className="me-2 text-primary" />
          {t('tools.ui.imageColorStudio.sidebarPalette')}
        </h2>
      ) : null}

      <div className="image-color-palette-toolbar image-color-palette-toolbar--sidebar">
        <Form.Group>
          <Form.Label className="fw-bold small">{t('tools.ui.imageColorStudio.paletteSize')}</Form.Label>
          <Form.Select
            size="sm"
            value={paletteSize}
            onChange={(event) => onPaletteSizeChange(Number(event.target.value))}
            disabled={!imageLoaded}
            aria-label={t('tools.ui.imageColorStudio.paletteSizeAria')}
          >
            {PALETTE_SIZES.map((size) => (
              <option key={size} value={size}>
                {t('tools.ui.imageColorStudio.colorsOption', { count: size })}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label className="fw-bold small">{t('tools.ui.imageColorStudio.paletteMood')}</Form.Label>
          <div className="image-color-mood-pills image-color-mood-pills--inline" role="group" aria-label={t('tools.ui.imageColorStudio.paletteMood')}>
            {PALETTE_MOODS.map((mood) => (
              <button
                key={mood}
                type="button"
                className={`image-color-mood-pill${paletteMood === mood ? ' is-active' : ''}`}
                disabled={!imageLoaded}
                onClick={() => onPaletteMoodChange(mood)}
              >
                {t(`tools.ui.imageColorStudio.moods.${mood}`)}
              </button>
            ))}
          </div>
        </Form.Group>
      </div>

      {!imageLoaded ? (
        <p className="small text-secondary mb-0">{t('tools.ui.imageColorStudio.paletteIntro')}</p>
      ) : null}

      {displayPalette.length ? (
        <div className="image-color-palette-results">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
            <span className="small fw-semibold">{t('tools.ui.imageColorStudio.extractedPalette')}</span>
            <div className="d-flex flex-wrap gap-1">
              <CopyButton text={hexList} label={t('tools.ui.imageColorStudio.copyHexList')} variant="outline-primary" />
              <CopyButton text={cssVariables} label={t('tools.ui.imageColorStudio.copyCssVars')} variant="outline-primary" />
            </div>
          </div>

          <p className="small text-secondary mb-2">{t('tools.ui.imageColorStudio.colorPickHint')}</p>

          <div className="image-color-palette-strip glass-card mb-3">
            {displayPalette.map((color, index) => {
              const pickHandlers = getColorPickHandlers(color);

              return (
                <button
                  key={`${color.hex}-${index}`}
                  type="button"
                  className="image-color-palette-strip-swatch"
                  style={{
                    backgroundColor: color.hex,
                    flexGrow: color.weight || 1,
                    flexBasis: `${((color.weight || 1) / totalWeight) * 100}%`,
                  }}
                  aria-label={t('tools.ui.imageColorStudio.selectPaletteColor', { hex: color.hex })}
                  {...pickHandlers}
                />
              );
            })}
          </div>

          <div className="image-color-sidebar-palette-chips">
            {displayPalette.map((color, index) => {
              const pickHandlers = getColorPickHandlers(color);

              return (
              <button
                key={`sidebar-${color.hex}-${index}`}
                type="button"
                className="image-color-creative-palette-chip glass-card"
                aria-label={t('tools.ui.imageColorStudio.selectPaletteColor', { hex: color.hex })}
                {...pickHandlers}
              >
                <span className="image-color-creative-palette-chip-swatch" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                <span className="image-color-sidebar-chip-meta">
                  <code className="small">{color.hex}</code>
                  {color.custom ? (
                    <Badge className="tool-category-badge">{t('tools.ui.imageColorStudio.customBadge')}</Badge>
                  ) : color.weight ? (
                    <span className="small text-secondary">
                      {t('tools.ui.imageColorStudio.pixelPercent', {
                        percent: Math.round((color.weight / (extractedPalette.reduce((s, c) => s + c.weight, 0) || 1)) * 100),
                      })}
                    </span>
                  ) : null}
                </span>
              </button>
              );
            })}
          </div>
        </div>
      ) : imageLoaded ? (
        <p className="small text-secondary mb-0">{t('tools.ui.imageColorStudio.extractError')}</p>
      ) : null}

      <div className="image-color-random-palette-section">
        <h3 className="h6 fw-bold mb-3">
          <MaterialIcon name="casino" className="me-2 text-primary" />
          {t('tools.ui.imageColorStudio.randomPaletteTitle')}
        </h3>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold small">{t('tools.ui.imageColorStudio.randomPaletteSize')}</Form.Label>
          <Form.Select
            size="sm"
            value={randomPaletteSize}
            onChange={(event) => onRandomSizeChange(Number(event.target.value))}
            aria-label={t('tools.ui.imageColorStudio.randomPaletteSizeAria')}
          >
            {PALETTE_SIZES.map((size) => (
              <option key={size} value={size}>
                {t('tools.ui.imageColorStudio.colorsOption', { count: size })}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold small">{t('tools.ui.imageColorStudio.randomPaletteStyle')}</Form.Label>
          <div className="image-color-mood-pills image-color-mood-pills--inline" role="group" aria-label={t('tools.ui.imageColorStudio.randomPaletteStyle')}>
            {RANDOM_PALETTE_STYLES.map((style) => (
              <button
                key={style}
                type="button"
                className={`image-color-mood-pill${randomPaletteStyle === style ? ' is-active' : ''}`}
                onClick={() => onRandomStyleChange(style)}
              >
                {t(`tools.ui.imageColorStudio.randomStyles.${style}`)}
              </button>
            ))}
          </div>
        </Form.Group>

        <Button variant="primary" size="sm" className="rounded-pill w-100" onClick={onGenerateRandom}>
          <MaterialIcon name="shuffle" className="me-2" />
          {t('tools.ui.imageColorStudio.generateRandomPalette')}
        </Button>
      </div>
    </section>
  );
}

export default ColorPaletteSidebar;
