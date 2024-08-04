import { Group } from './GroupComponent'
import Button from '../general/Button'
import "../../styles/components/group/GroupNavbar.css"
import { useState } from 'react';
import ExportModal from '../expense/ExportModal';

interface GroupNavbarProps {
  group: Group | null;
  isLoading: boolean;
  error: unknown | null;
  setShowAddExpenseForm: React.Dispatch<React.SetStateAction<boolean>>;
  showAddExpenseForm: boolean;
  setShowSettleUpForm: React.Dispatch<React.SetStateAction<boolean>>;
  exportExpensesToExcel: () => void;
}

const GroupNavbar: React.FC<GroupNavbarProps> = ({
  group,
  isLoading,
  error,
  setShowAddExpenseForm,
  showAddExpenseForm,
  setShowSettleUpForm,
  exportExpensesToExcel,
}) => {
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const openExportModal = () => setShowExportModal(true);
  const closeExportModal = () => setShowExportModal(false);

  const handleExportExpenses = () => {
    exportExpensesToExcel();
    closeExportModal();
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <nav className='group-navbar'>
      <h1>{group?.name}</h1>
      <div>
        <Button
          label='Add Expense'
          onClick={() => {
            setShowAddExpenseForm(!showAddExpenseForm);
          }}
        />
        <Button
          label='Settle Up'
          onClick={() => {
            setShowSettleUpForm(true);
          }}
          backgroundColor='var(--secondary-color)'
        />
        <Button
          label='Export'
          onClick={() => {
            openExportModal();
          }}
          backgroundColor='var(--light-gray)'
        />
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={closeExportModal}
        onConfirm={handleExportExpenses}
        title="Export Expenses"
      >
        <p>Select month and/or year filter if you want to filter exports</p>
      </ExportModal>
    </nav>
  )
}

export default GroupNavbar;