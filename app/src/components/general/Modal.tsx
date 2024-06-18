import React from 'react';
import '../../styles/components/general/Modal.css'

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
    <div className='modal-backdrop'>
      <div className='modal-content'>
        <h2>{title}</h2>
        <div>{children}</div>
        <div>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
