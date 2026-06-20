import './AnimatedButton.css';

interface AnimatedButtonProps {
  children: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children }) => {
  return (
    <button className="button button-item">
      {children}
    </button>
  );
};

export default AnimatedButton;
