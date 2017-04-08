import { useTranslation } from 'react-i18next';
import MaterialIcon from '../../common/MaterialIcon';

function ColorFavoritesTray({ favorites, activeHex, onSelect, onRemove }) {
  const { t } = useTranslation();

  if (!favorites.length) return null;

  return (
    <section className="image-color-favorites" aria-label={t('tools.ui.imageColorStudio.favoritesAria')}>
      <div className="image-color-favorites-header">
        <h2 className="h6 fw-bold mb-0">
          <MaterialIcon name="favorite" className="me-2 text-primary" />
          {t('tools.ui.imageColorStudio.favoritesTitle')}
        </h2>
        <span className="small text-secondary">{t('tools.ui.imageColorStudio.favoritesHint')}</span>
      </div>
      <div className="image-color-favorites-list">
        {favorites.map((color) => {
          const isActive = activeHex?.toLowerCase() === color.hex.toLowerCase();

          return (
            <div key={color.hex} className={`image-color-favorite-chip${isActive ? ' is-active' : ''}`}>
              <button
                type="button"
                className="image-color-favorite-swatch"
                style={{ backgroundColor: color.hex }}
                onClick={() => onSelect(color)}
                aria-label={t('tools.ui.imageColorStudio.selectFavorite', { hex: color.hex })}
              />
              <code className="image-color-favorite-hex">{color.hex}</code>
              <button
                type="button"
                className="image-color-favorite-remove"
                onClick={() => onRemove(color.hex)}
                aria-label={t('tools.ui.imageColorStudio.removeFavorite', { hex: color.hex })}
              >
                <MaterialIcon name="close" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ColorFavoritesTray;
