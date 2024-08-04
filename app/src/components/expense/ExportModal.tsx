import React from 'react';
import '../../styles/components/general/Modal.css'

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
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

export default ExportModal;
