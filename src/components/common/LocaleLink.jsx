import { Link } from 'react-router-dom';
import { useLocalizedPath } from '../../i18n/useLocale';

export default function LocaleLink({ to, ...props }) {
  const localizedPath = useLocalizedPath();
  return <Link to={localizedPath(to)} {...props} />;
}
