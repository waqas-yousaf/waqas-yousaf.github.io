import MaterialIcon from '../common/MaterialIcon';

function ToolStatus({ valid, message }) {
  if (!message) return null;

  const variant = valid === true ? 'success' : valid === false ? 'danger' : 'info';
  const icon = valid === true ? 'check_circle' : valid === false ? 'cancel' : 'info';

  return (
    <div className={`tool-status mb-3 tool-status-${variant}`} role="status">
      <MaterialIcon name={icon} className="me-2" />
      <span>{message}</span>
    </div>
  );
}

export default ToolStatus;
