import { useTranslation } from 'react-i18next';
import { getPasswordStrength } from '../../utils/toolHelpers';

const SEGMENT_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#3b82f6', '#22c55e'];

function PasswordStrength({ password }) {
  const { t } = useTranslation();
  const strength = getPasswordStrength(password);

  return (
    <div className="password-strength mt-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="small fw-semibold">{t('tools.ui.shared.strength')}</span>
        <span className={`small fw-bold password-strength-label ${strength.className}`}>{strength.label}</span>
      </div>

      <div className="password-strength-segments" aria-hidden="true">
        {SEGMENT_COLORS.map((color, index) => (
          <span
            key={color}
            className={`password-strength-segment${index < strength.litSegments ? ' is-lit' : ''}`}
            style={{ '--segment-color': color }}
          />
        ))}
      </div>

      <div className="password-strength-meta small text-secondary mt-2">
        <span>{t('tools.ui.password.strengthScore', { score: strength.score, max: strength.maxScore })}</span>
        <span className="password-strength-meta-sep" aria-hidden="true">
          ·
        </span>
        <span>{t('tools.ui.password.entropyBits', { bits: strength.entropyBits })}</span>
      </div>
    </div>
  );
}

export default PasswordStrength;
