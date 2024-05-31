import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div>
      <h2>{title}</h2>
      <div>{children}</div>
      <div>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default Modal;
