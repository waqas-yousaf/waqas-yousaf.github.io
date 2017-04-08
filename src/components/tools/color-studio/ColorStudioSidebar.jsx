import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToolTabNav from '../ToolTabNav';
import ColorEyedropperPanel from './ColorEyedropperPanel';
import ColorPaletteSidebar from './ColorPaletteSidebar';
import ColorFavoritesTray from './ColorFavoritesTray';

function ColorStudioSidebar({
  activeColor,
  pickerHex,
  favorites,
  imageLoaded,
  paletteSize,
  paletteMood,
  extractedPalette,
  customPalette,
  displayPalette,
  onActiveColorChange,
  onPickerHexChange,
  onStatusChange,
  onAddFavorite,
  onAddToCustomPalette,
  onPaletteSizeChange,
  onPaletteMoodChange,
  randomPaletteSize,
  randomPaletteStyle,
  onRandomSizeChange,
  onRandomStyleChange,
  onGenerateRandom,
  onContrastForegroundChange,
  onClearCustomPalette,
  onRemoveCustomColor,
  onRemoveFavorite,
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('picker');

  const tabs = [
    {
      id: 'picker',
      icon: 'colorize',
      label: t('tools.ui.imageColorStudio.sidebarEyedropper'),
      hint: t('tools.ui.imageColorStudio.tabEyedropperHint'),
    },
    {
      id: 'palette',
      icon: 'gradient',
      label: t('tools.ui.imageColorStudio.sidebarPalette'),
      hint: t('tools.ui.imageColorStudio.tabPaletteHint'),
    },
  ];

  return (
    <>
      <div className="image-color-sidebar-section image-color-sidebar-tabs">
        <ToolTabNav
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel={t('tools.ui.imageColorStudio.sidebarTabNavAria')}
          className="image-color-sidebar-tab-nav mb-0"
        />

        {activeTab === 'picker' ? (
          <ColorEyedropperPanel
            variant="sidebar"
            tabbed
            activeColor={activeColor}
            pickerHex={pickerHex}
            customPalette={customPalette}
            onActiveColorChange={onActiveColorChange}
            onPickerHexChange={onPickerHexChange}
            onStatusChange={onStatusChange}
            onAddFavorite={onAddFavorite}
            onAddToCustomPalette={onAddToCustomPalette}
            onRemoveCustomColor={onRemoveCustomColor}
            onClearCustomPalette={onClearCustomPalette}
          />
        ) : null}

        {activeTab === 'palette' ? (
          <ColorPaletteSidebar
            tabbed
            imageLoaded={imageLoaded}
            paletteSize={paletteSize}
            paletteMood={paletteMood}
            extractedPalette={extractedPalette}
            displayPalette={displayPalette}
            onPaletteSizeChange={onPaletteSizeChange}
            onPaletteMoodChange={onPaletteMoodChange}
            randomPaletteSize={randomPaletteSize}
            randomPaletteStyle={randomPaletteStyle}
            onRandomSizeChange={onRandomSizeChange}
            onRandomStyleChange={onRandomStyleChange}
            onGenerateRandom={onGenerateRandom}
            onSelectColor={onActiveColorChange}
            onContrastForegroundChange={onContrastForegroundChange}
          />
        ) : null}
      </div>

      <ColorFavoritesTray
        favorites={favorites}
        activeHex={activeColor.hex}
        onSelect={onActiveColorChange}
        onRemove={onRemoveFavorite}
      />
    </>
  );
}

export default ColorStudioSidebar;
