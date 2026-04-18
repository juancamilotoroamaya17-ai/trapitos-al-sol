import './GlassCard.css';

export const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
};
