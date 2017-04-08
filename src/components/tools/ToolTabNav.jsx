import MaterialIcon from '../common/MaterialIcon';

function ToolTabNav({ tabs, activeTab, onTabChange, ariaLabel, className = '' }) {
  return (
    <div className={`tool-tab-nav${className ? ` ${className}` : ''}`} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tool-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tool-tabpanel-${tab.id}`}
            className={`tool-tab-nav-btn${isActive ? ' is-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <MaterialIcon name={tab.icon} className="tool-tab-nav-icon" />
            <span className="tool-tab-nav-label">{tab.label}</span>

          </button>
        );
      })}
    </div>
  );
}

export default ToolTabNav;
