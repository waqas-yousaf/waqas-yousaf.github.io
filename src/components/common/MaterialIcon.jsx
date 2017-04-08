function MaterialIcon({ name, className = '', ...props }) {
  return (
    <span className={`material-icons${className ? ` ${className}` : ''}`} aria-hidden="true" {...props}>
      {name}
    </span>
  );
}

export default MaterialIcon;
