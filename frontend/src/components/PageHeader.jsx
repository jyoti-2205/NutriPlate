import React from 'react';

const PageHeader = ({ icon, title, subtitle, badge }) => (
  <div className="page-header">
    <div className="page-header-text">
      {badge && <span className="page-badge">{badge}</span>}
      <h1>{icon && <span className="page-icon">{icon}</span>}{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  </div>
);

export default PageHeader;
