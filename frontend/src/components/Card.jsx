import React from 'react';

const Card = ({ children, className = '', title, action, ...props }) => {
  return (
    <div className={`bg-bg-card rounded-2xl shadow-sm border border-border p-6 ${className}`} {...props}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-lg font-semibold text-primary">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
