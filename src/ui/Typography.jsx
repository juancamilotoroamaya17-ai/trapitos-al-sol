import './Typography.css';

export const Typography = ({ variant = 'body', children, className = '' }) => {
  return (
    <div className={`typography-${variant} ${className}`}>
      {children}
    </div>
  );
};
