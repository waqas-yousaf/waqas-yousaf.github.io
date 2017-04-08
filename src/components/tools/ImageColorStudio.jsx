import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import ToolLayout from './ToolLayout';
import MaterialIcon from '../common/MaterialIcon';
import ColorEyedropperOverlays from './color-studio/ColorEyedropperOverlays';
import ColorStudioSidebar from './color-studio/ColorStudioSidebar';
import ColorCreativePanel from './color-studio/ColorCreativePanel';
import ColorStudioSplash, { WELCOME_STORAGE_KEY } from './color-studio/ColorStudioSplash';
import ColorStudioTopBar from './color-studio/ColorStudioTopBar';
import { useImageCanvas } from '../../hooks/useImageCanvas';
import { useTool } from '../../data/tools';
import {
  DEFAULT_ACTIVE_COLOR,
  appendFavorite,
  appendToCustomPalette,
  extractPaletteWithMood,
  generateRandomPalette,
  mergePalettes,
  removeCustomPaletteByHex,
  removeFavoriteByHex,
} from '../../utils/colorStudio';

function readWelcomeSeen() {
  try {
    return localStorage.getItem(WELCOME_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function ImageColorStudio() {
  const { t } = useTranslation();
  const tool = useTool('image-color-studio');
  const [showWelcome, setShowWelcome] = useState(() => !readWelcomeSeen());
  const [activeColor, setActiveColor] = useState(DEFAULT_ACTIVE_COLOR);
  const [pickerHex, setPickerHex] = useState(DEFAULT_ACTIVE_COLOR.hex);
  const [favorites, setFavorites] = useState([]);
  const [customPalette, setCustomPalette] = useState([]);
  const [extractedPalette, setExtractedPalette] = useState([]);
  const [paletteSize, setPaletteSize] = useState(6);
  const [paletteMood, setPaletteMood] = useState('dominant');
  const [randomPaletteSize, setRandomPaletteSize] = useState(6);
  const [randomPaletteStyle, setRandomPaletteStyle] = useState('vibrant');
  const [contrastForegroundHex, setContrastForegroundHex] = useState('#ffffff');

  const {
    canvasRef,
    imageRef,
    fileInputRef,
    stageRef,
    imageLoaded,
    imageName,
    status,
    imageRevision,
    isDragging,
    dropZoneProps,
    setStatus,
    clearImage,
    openFilePicker,
    handleFileInputChange,
  } = useImageCanvas();

  const dismissWelcome = useCallback(() => {
    try {
      localStorage.setItem(WELCOME_STORAGE_KEY, '1');
    } catch {
      /* ignore storage errors */
    }
    setShowWelcome(false);
  }, []);

  const handleGetStarted = useCallback(() => {
    dismissWelcome();
    setStatus(t('tools.ui.imageColorStudio.statusInitial'));
  }, [dismissWelcome, setStatus, t]);

  const handleSplashUpload = useCallback(() => {
    dismissWelcome();
    openFilePicker();
  }, [dismissWelcome, openFilePicker]);

  const regeneratePalette = useCallback(() => {
    if (!imageRef.current) return;

    const colors = extractPaletteWithMood(imageRef.current, paletteSize, paletteMood);
    setExtractedPalette(colors);
    setStatus(
      colors.length
        ? t('tools.ui.imageColorStudio.generated', { count: colors.length })
        : t('tools.ui.imageColorStudio.extractError')
    );
  }, [imageRef, paletteMood, paletteSize, setStatus, t]);

  const handleGenerateRandomPalette = useCallback(() => {
    const colors = generateRandomPalette(randomPaletteSize, randomPaletteStyle);
    setExtractedPalette(colors);
    setStatus(t('tools.ui.imageColorStudio.randomPaletteGenerated', { count: colors.length }));
  }, [randomPaletteSize, randomPaletteStyle, setStatus, t]);

  useEffect(() => {
    if (imageRef.current && imageLoaded) {
      regeneratePalette();
    }
  }, [imageLoaded, imageRevision, paletteSize, paletteMood, regeneratePalette, imageRef]);

  const displayPalette = useMemo(
    () => mergePalettes(extractedPalette, customPalette),
    [customPalette, extractedPalette]
  );

  const handleActiveColorChange = useCallback((color) => {
    setActiveColor(color);
    setPickerHex(color.hex);
  }, []);

  const handleAddFavorite = useCallback(
    (color) => {
      setFavorites((current) => appendFavorite(current, color));
      setStatus(t('tools.ui.imageColorStudio.favoriteAdded', { hex: color.hex }));
    },
    [setStatus, t]
  );

  const handleAddToCustomPalette = useCallback(
    (color) => {
      setCustomPalette((current) => appendToCustomPalette(current, color));
      setStatus(t('tools.ui.imageColorStudio.customAdded', { hex: color.hex }));
    },
    [setStatus, t]
  );

  const handleRemoveCustomColor = useCallback(
    (hex) => {
      setCustomPalette((current) => removeCustomPaletteByHex(current, hex));
      setStatus(t('tools.ui.imageColorStudio.customRemoved', { hex }));
    },
    [setStatus, t]
  );

  const handleEyedropperSample = useCallback(
    (color, picked) => {
      if (picked) handleActiveColorChange(color);
    },
    [handleActiveColorChange]
  );

  if (!tool) return null;

  const dropAction = imageLoaded
    ? t('tools.ui.imageColorStudio.dropReplace')
    : t('tools.ui.imageColorStudio.dropLoad');

  return (
    <ToolLayout toolId={tool.id} immersive>
      {showWelcome ? <ColorStudioSplash onGetStarted={handleGetStarted} onUpload={handleSplashUpload} /> : null}

      <div className="image-color-studio" aria-hidden={showWelcome || undefined}>
        <input ref={fileInputRef} type="file" accept="image/*" className="d-none" onChange={handleFileInputChange} />

        <ColorStudioTopBar title={tool.longTitle} imageName={imageName} status={status} />

        <div className="image-color-workspace">
          <aside className="image-color-sidebar">
            <ColorStudioSidebar
              activeColor={activeColor}
              pickerHex={pickerHex}
              favorites={favorites}
              imageLoaded={imageLoaded}
              paletteSize={paletteSize}
              paletteMood={paletteMood}
              extractedPalette={extractedPalette}
              customPalette={customPalette}
              displayPalette={displayPalette}
              onActiveColorChange={handleActiveColorChange}
              onPickerHexChange={setPickerHex}
              onStatusChange={setStatus}
              onAddFavorite={handleAddFavorite}
              onAddToCustomPalette={handleAddToCustomPalette}
              onPaletteSizeChange={setPaletteSize}
              onPaletteMoodChange={setPaletteMood}
              randomPaletteSize={randomPaletteSize}
              randomPaletteStyle={randomPaletteStyle}
              onRandomSizeChange={setRandomPaletteSize}
              onRandomStyleChange={setRandomPaletteStyle}
              onGenerateRandom={handleGenerateRandomPalette}
              onContrastForegroundChange={setContrastForegroundHex}
              onClearCustomPalette={() => setCustomPalette([])}
              onRemoveCustomColor={handleRemoveCustomColor}
              onRemoveFavorite={(hex) => setFavorites((current) => removeFavoriteByHex(current, hex))}
            />
          </aside>

          <div className="image-color-main">
            <div
              ref={stageRef}
              className={`image-color-stage ${imageLoaded ? 'is-loaded' : ''} ${isDragging ? 'is-dragging' : ''} ${imageLoaded ? 'is-eyedropper' : ''}`}
              {...dropZoneProps}
            >
              {!imageLoaded ? (
                <div
                  className="image-color-placeholder"
                  role="button"
                  tabIndex={0}
                  aria-label={t('tools.ui.shared.upload')}
                  onClick={openFilePicker}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openFilePicker();
                    }
                  }}
                >
                  <MaterialIcon name="image" className="image-color-placeholder-icon" />
                  <p className="mb-1 fw-semibold">{t('tools.ui.imageColorStudio.dropPlaceholderTitle')}</p>
                  <p className="small text-secondary mb-0">{t('tools.ui.imageColorStudio.pasteHint')}</p>
                </div>
              ) : null}

              {isDragging ? (
                <div className="image-tool-drop-overlay" aria-hidden="true">
                  <MaterialIcon name="file_download" className="image-tool-drop-overlay-icon" />
                  <span>{t('tools.ui.imageColorStudio.dropOverlay', { action: dropAction })}</span>
                </div>
              ) : null}

              <canvas
                ref={canvasRef}
                className="image-color-stage-canvas"
                aria-label={t('tools.ui.imageColorStudio.canvasAria')}
                {...dropZoneProps}
              />

              {imageLoaded ? (
                <ColorEyedropperOverlays
                  canvasRef={canvasRef}
                  stageRef={stageRef}
                  imageLoaded={imageLoaded}
                  onSample={handleEyedropperSample}
                  onStatusChange={setStatus}
                />
              ) : null}
            </div>

            {imageLoaded ? (
              <div className="image-color-clear-row">
                <Button variant="outline-secondary" className="rounded-pill" onClick={clearImage}>
                  <MaterialIcon name="delete" className="me-2" />
                  {t('tools.ui.shared.clearImage')}
                </Button>
              </div>
            ) : null}

            <ColorCreativePanel
              activeColor={activeColor}
              customPalette={customPalette}
              extractedPalette={extractedPalette}
              contrastForegroundHex={contrastForegroundHex}
              onContrastForegroundChange={setContrastForegroundHex}
              onActiveColorChange={handleActiveColorChange}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

export default ImageColorStudio;
