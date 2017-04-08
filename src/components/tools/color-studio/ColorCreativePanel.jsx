import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import CopyButton from '../CopyButton';
import MaterialIcon from '../../common/MaterialIcon';
import { hexToRgb, downloadTextFile } from '../../../utils/toolHelpers';
import { useColorPickHandler } from '../../../hooks/useColorPickHandler';
import {
  CONIC_GRADIENT_ANGLES,
  CONTRAST_PREVIEW_SIZES,
  GRADIENT_TYPES,
  HARMONY_TYPES,
  LINEAR_GRADIENT_DIRECTIONS,
  RADIAL_GRADIENT_SHAPES,
  buildCssVariables,
  buildDesignTokens,
  buildGradientCss,
  buildHexList,
  buildLessVariables,
  buildPaletteCsv,
  buildPaletteJson,
  buildPaletteSvg,
  buildScssMap,
  buildTailwindColors,
  generateHarmony,
  getBestNearestContrastForeground,
  getContrastPairReport,
} from '../../../utils/colorStudio';

function ContrastBadge({ label, passed }) {
  return (
    <Badge bg={passed ? 'success' : 'danger'} className="image-color-contrast-badge">
      {label}
    </Badge>
  );
}

function CustomContrastCard({
  backgroundHex,
  foregroundHex,
  sampleLabel,
  levels,
  smallTextLabel,
  largeTextLabel,
  normalTierLabel,
  largeTierLabel,
}) {
  return (
    <div className="image-color-contrast-card glass-card " style={{ backgroundColor: backgroundHex, color: foregroundHex }}>
      <div className="image-color-contrast-meta image-color-contrast-meta--header">
        <span className="fw-semibold fs-5">Contrast Ratio: {levels.ratio}:1</span>
        <code className="small " style={{position: 'absolute', right: '10px', top: '10px', fontSize:'40px', opacity:'0.3', color: foregroundHex }}>{foregroundHex}</code>
      </div>

      <div className="image-color-contrast-sample-row">

        <span
          className="image-color-contrast-sample image-color-contrast-sample--small"
          style={{ fontSize: `${CONTRAST_PREVIEW_SIZES.small}px` }}
        >
          {sampleLabel}
        </span>
        <div className="d-flex flex-wrap gap-1">
          <ContrastBadge label={`AA ${normalTierLabel}`} passed={levels.normalAA} />
          <ContrastBadge label={`AAA ${normalTierLabel}`} passed={levels.normalAAA} />
        </div>
      </div>

      <div className="image-color-contrast-sample-row">

        <span
          className="image-color-contrast-sample image-color-contrast-sample--large"
          style={{ fontSize: `${CONTRAST_PREVIEW_SIZES.large}px` }}
        >
          {sampleLabel}
        </span>
        <div className="d-flex flex-wrap gap-1">
          <ContrastBadge label={`AA ${largeTierLabel}`} passed={levels.largeAA} />
          <ContrastBadge label={`AAA ${largeTierLabel}`} passed={levels.largeAAA} />
        </div>
      </div>
    </div>
  );
}

function CreativeCollapsibleSection({ id, icon, title, open, onToggle, children }) {
  const panelId = `creative-panel-${id}`;

  return (
    <section className={`image-color-creative-section image-color-creative-collapsible${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="image-color-creative-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="image-color-creative-toggle-heading">
          <MaterialIcon name={icon} className="me-2 text-primary" />
          <span className="h6 fw-bold mb-0">{title}</span>
        </span>
        <MaterialIcon name={open ? 'expand_less' : 'expand_more'} className="image-color-creative-toggle-icon" />
      </button>
      <div id={panelId} className="pt-2 image-color-creative-collapsible-body" hidden={!open}>
        {children}
      </div>
    </section>
  );
}

function DownloadButton({ text, filename, label, disabled = false }) {
  return (
    <Button
      variant="outline-secondary"
      size="sm"
      className="rounded-pill"
      disabled={disabled || !text}
      onClick={() => downloadTextFile(text, filename)}
    >
      <MaterialIcon name="download" className="me-1" />
      {label}
    </Button>
  );
}

function ColorCreativePanel({
  activeColor,
  customPalette = [],
  extractedPalette = [],
  contrastForegroundHex,
  onContrastForegroundChange,
  onActiveColorChange,
}) {
  const { t } = useTranslation();
  const [harmoniesOpen, setHarmoniesOpen] = useState(false);
  const [gradientOpen, setGradientOpen] = useState(false);
  const [exportsOpen, setExportsOpen] = useState(false);
  const [gradientType, setGradientType] = useState(GRADIENT_TYPES[0].id);
  const [gradientDirection, setGradientDirection] = useState(LINEAR_GRADIENT_DIRECTIONS[0].id);
  const [gradientRepeat, setGradientRepeat] = useState(false);
  const [customSampleText, setCustomSampleText] = useState(() => t('tools.ui.imageColorStudio.contrastCustomSample'));
  const [exportSource, setExportSource] = useState('image');

  const getColorPickHandlers = useColorPickHandler(onActiveColorChange, onContrastForegroundChange);

  const gradientSource = extractedPalette.length ? extractedPalette : [activeColor];
  const gradientCss = buildGradientCss(gradientSource, {
    type: gradientType,
    direction: gradientDirection,
    repeat: gradientRepeat,
  });

  const exportColors = useMemo(() => {
    if (exportSource === 'custom') return customPalette;
    return extractedPalette.length ? extractedPalette : [activeColor];
  }, [exportSource, customPalette, extractedPalette, activeColor]);

  const canExport = exportColors.length >= 2;
  const exportFilePrefix = exportSource === 'custom' ? 'custom-palette' : 'image-palette';

  const customContrast = useMemo(
    () => getContrastPairReport(activeColor.hex, contrastForegroundHex),
    [activeColor.hex, contrastForegroundHex]
  );

  const directionOptions = useMemo(() => {
    if (gradientType === 'radial') return RADIAL_GRADIENT_SHAPES;
    if (gradientType === 'conic') return CONIC_GRADIENT_ANGLES;
    return LINEAR_GRADIENT_DIRECTIONS;
  }, [gradientType]);

  const exportPayload = useMemo(
    () => ({
      hexList: buildHexList(exportColors),
      cssVars: buildCssVariables(exportColors),
      scss: buildScssMap(exportColors),
      tailwind: buildTailwindColors(exportColors),
      less: buildLessVariables(exportColors),
      json: buildPaletteJson(exportColors),
      csv: buildPaletteCsv(exportColors),
      svg: buildPaletteSvg(exportColors),
      designTokens: buildDesignTokens(exportColors),
    }),
    [exportColors]
  );

  useEffect(() => {
    const defaults = directionOptions[0]?.id;
    if (defaults && !directionOptions.some((option) => option.id === gradientDirection)) {
      setGradientDirection(defaults);
    }
  }, [gradientType, directionOptions, gradientDirection]);

  const handleCustomTextChange = (hexValue) => {
    onContrastForegroundChange(hexValue);
    try {
      hexToRgb(hexValue);
    } catch {
      /* keep last valid preview */
    }
  };

  const applyBestNearestColor = () => {
    onContrastForegroundChange(getBestNearestContrastForeground(activeColor.hex));
  };

  const handleGradientTypeChange = (type) => {
    setGradientType(type);
    if (type === 'radial') setGradientDirection(RADIAL_GRADIENT_SHAPES[0].id);
    else if (type === 'conic') setGradientDirection(CONIC_GRADIENT_ANGLES[0].id);
    else setGradientDirection(LINEAR_GRADIENT_DIRECTIONS[0].id);
    if (type !== 'linear') setGradientRepeat(false);
  };

  return (
    <div className="image-color-creative-panel">
      <section className="image-color-creative-section image-color-creative-section--static">
        <h2 className="h6 fw-bold mb-3">
          <MaterialIcon name="contrast" className="me-2 text-primary" />
          {t('tools.ui.imageColorStudio.contrastTitle')}
        </h2>

        <div className="image-color-creative-section-wrap">

        <div className="image-color-contrast-toolbar mb-3">
          <Form.Control
            type="color"
            value={contrastForegroundHex}
            onChange={(event) => handleCustomTextChange(event.target.value)}
            className="image-color-native-picker image-color-contrast-toolbar-picker"
            aria-label={t('tools.ui.imageColorStudio.contrastForegroundAria')}
          />
          <Form.Control
            size="sm"
            value={contrastForegroundHex}
            onChange={(event) => handleCustomTextChange(event.target.value)}
            placeholder={t('tools.ui.imageColorStudio.contrastHexPlaceholder')}
            className="font-monospace image-color-contrast-toolbar-hex"
            aria-label={t('tools.ui.imageColorStudio.contrastForegroundAria')}
          />
          <Form.Control
            size="sm"
            value={customSampleText}
            onChange={(event) => setCustomSampleText(event.target.value)}
            placeholder={t('tools.ui.imageColorStudio.contrastSampleTextPlaceholder')}
            aria-label={t('tools.ui.imageColorStudio.contrastSampleTextAria')}
            className="image-color-contrast-toolbar-text"
          />
          <Button variant="outline-secondary" size="sm" className="rounded-pill image-color-contrast-toolbar-nearest" onClick={applyBestNearestColor}>
            {t('tools.ui.imageColorStudio.contrastBestNearest')}
          </Button>
        </div>

        <div className="image-color-contrast-grid">
          <CustomContrastCard
            backgroundHex={activeColor.hex}
            foregroundHex={contrastForegroundHex}
            sampleLabel={customSampleText || t('tools.ui.imageColorStudio.contrastCustomSample')}
            levels={customContrast}
            smallTextLabel={t('tools.ui.imageColorStudio.contrastSmallText')}
            largeTextLabel={t('tools.ui.imageColorStudio.contrastLargeText')}
            normalTierLabel={t('tools.ui.imageColorStudio.normal')}
            largeTierLabel={t('tools.ui.imageColorStudio.large')}
          />
        </div>
        </div>

      </section>

      <CreativeCollapsibleSection
        id="harmonies"
        icon="palette"
        title={t('tools.ui.imageColorStudio.harmoniesTitle')}
        open={harmoniesOpen}
        onToggle={() => setHarmoniesOpen((current) => !current)}
      >
        <p className="small text-secondary mb-3">
          {t('tools.ui.imageColorStudio.harmoniesHint', { hex: activeColor.hex })}
        </p>
        <p className="small text-secondary mb-3">{t('tools.ui.imageColorStudio.colorPickHint')}</p>

        <div className="image-color-harmony-grid image-color-harmony-grid--expanded">
          {HARMONY_TYPES.map((type) => {
            const colors = generateHarmony(activeColor.hex, type);
            const hexList = colors.map((color) => color.hex).join(', ');

            return (
              <div key={type} className="image-color-harmony-card glass-card">
                <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                  <span className="fw-semibold small">{t(`tools.ui.imageColorStudio.harmonies.${type}`)}</span>
                  <CopyButton text={hexList} />
                </div>
                <div className="image-color-harmony-strip">
                  {colors.map((color) => {
                    const pickHandlers = getColorPickHandlers(color);

                    return (
                      <button
                        key={`${type}-${color.hex}`}
                        type="button"
                        className="image-color-harmony-swatch"
                        style={{ backgroundColor: color.hex }}
                        title={color.hex}
                        aria-label={t('tools.ui.imageColorStudio.selectPaletteColor', { hex: color.hex })}
                        {...pickHandlers}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CreativeCollapsibleSection>

      <CreativeCollapsibleSection
        id="gradient"
        icon="gradient"
        title={t('tools.ui.imageColorStudio.gradientTitle')}
        open={gradientOpen}
        onToggle={() => setGradientOpen((current) => !current)}
      >
        <div className="row g-2 mb-3">
          <div className="col-sm-6">
            <Form.Select
              value={gradientType}
              onChange={(event) => handleGradientTypeChange(event.target.value)}
              aria-label={t('tools.ui.imageColorStudio.gradientType')}
            >
              {GRADIENT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {t(`tools.ui.imageColorStudio.gradientTypes.${type.labelKey}`)}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-sm-6">
            <Form.Select
              value={gradientDirection}
              onChange={(event) => setGradientDirection(event.target.value)}
              aria-label={t('tools.ui.imageColorStudio.gradientDirection')}
            >
              {directionOptions.map((direction) => (
                <option key={direction.id} value={direction.id}>
                  {t(`tools.ui.imageColorStudio.gradientDirections.${direction.labelKey}`)}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        {gradientType === 'linear' ? (
          <Form.Check
            type="checkbox"
            id="gradient-repeat"
            className="mb-3"
            label={t('tools.ui.imageColorStudio.gradientRepeat')}
            checked={gradientRepeat}
            onChange={(event) => setGradientRepeat(event.target.checked)}
          />
        ) : null}

        <div className="image-color-gradient-preview glass-card mb-3" style={{ background: gradientCss }} aria-hidden="true" />
        <CopyButton text={gradientCss} label={t('tools.ui.imageColorStudio.copyGradient')} variant="outline-primary" />
      </CreativeCollapsibleSection>

      <CreativeCollapsibleSection
        id="exports"
        icon="download"
        title={t('tools.ui.imageColorStudio.exportsTitle')}
        open={exportsOpen}
        onToggle={() => setExportsOpen((current) => !current)}
      >
        <div className="image-color-export-source-switch mb-3" role="group" aria-label={t('tools.ui.imageColorStudio.exportSourceAria')}>
          <button
            type="button"
            className={`image-color-export-source-btn${exportSource === 'image' ? ' is-active' : ''}`}
            onClick={() => setExportSource('image')}
          >
            {t('tools.ui.imageColorStudio.exportImagePalette')}
          </button>
          <button
            type="button"
            className={`image-color-export-source-btn${exportSource === 'custom' ? ' is-active' : ''}`}
            onClick={() => setExportSource('custom')}
          >
            {t('tools.ui.imageColorStudio.exportCustomPalette')}
          </button>
        </div>

        {!canExport ? (
          <p className="small text-secondary mb-3">{t('tools.ui.imageColorStudio.exportMinColorsHint')}</p>
        ) : null}

        <div className="d-flex flex-wrap gap-2 mb-2">
          <CopyButton text={exportPayload.hexList} label={t('tools.ui.imageColorStudio.copyHexList')} variant="outline-primary" disabled={!canExport} />
          <CopyButton text={exportPayload.cssVars} label={t('tools.ui.imageColorStudio.copyCssVars')} variant="outline-primary" disabled={!canExport} />
          <CopyButton text={exportPayload.scss} label={t('tools.ui.imageColorStudio.copyScss')} variant="outline-primary" disabled={!canExport} />
          <CopyButton text={exportPayload.tailwind} label={t('tools.ui.imageColorStudio.copyTailwind')} variant="outline-primary" disabled={!canExport} />
          <CopyButton text={exportPayload.less} label={t('tools.ui.imageColorStudio.copyLess')} variant="outline-primary" disabled={!canExport} />
          <CopyButton text={exportPayload.json} label={t('tools.ui.imageColorStudio.copyJson')} variant="outline-primary" disabled={!canExport} />
          <CopyButton text={exportPayload.csv} label={t('tools.ui.imageColorStudio.copyCsv')} variant="outline-primary" disabled={!canExport} />
          <CopyButton text={exportPayload.svg} label={t('tools.ui.imageColorStudio.copySvg')} variant="outline-primary" disabled={!canExport} />
          <CopyButton text={exportPayload.designTokens} label={t('tools.ui.imageColorStudio.copyDesignTokens')} variant="outline-primary" disabled={!canExport} />
        </div>
        <div className="d-flex flex-wrap gap-2">
          <DownloadButton text={exportPayload.json} filename={`${exportFilePrefix}.json`} label={t('tools.ui.imageColorStudio.downloadJson')} disabled={!canExport} />
          <DownloadButton text={exportPayload.csv} filename={`${exportFilePrefix}.csv`} label={t('tools.ui.imageColorStudio.downloadCsv')} disabled={!canExport} />
          <DownloadButton text={exportPayload.svg} filename={`${exportFilePrefix}.svg`} label={t('tools.ui.imageColorStudio.downloadSvg')} disabled={!canExport} />
        </div>
      </CreativeCollapsibleSection>
    </div>
  );
}

export default ColorCreativePanel;
