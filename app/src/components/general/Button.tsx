import "../../styles/components/general/Button.css"

interface ButtonProps {
  label: string;
  onClick: () => void;
  hoverColor?: string;
  backgroundColor?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, hoverColor, backgroundColor }) => {
  return (
    <button
      className="button"
      onClick={onClick}
      style={{ 
        '--hover-color': hoverColor,
        'backgroundColor': backgroundColor,
      } as React.CSSProperties}
    >
      {label}
    </button>
  );
};

export default Button;