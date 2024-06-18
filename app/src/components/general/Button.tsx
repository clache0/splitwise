import "../../styles/components/general/Button.css"

interface ButtonProps {
  label: string;
  onClick: () => void;
  hoverColor?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, hoverColor }) => {
  return (
    <button
      className="button"
      onClick={onClick}
      style={{ '--hover-color': hoverColor } as React.CSSProperties}
    >
      {label}
    </button>
  );
};

export default Button;