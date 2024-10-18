import { Group, User } from './GroupComponent'
import Button from '../general/Button'
import "../../styles/components/group/GroupNavbar.css"
import { useState } from 'react';
import ExportModal from '../expense/ExportModal';
import { getNameFromId } from '../../api/utils';

interface GroupNavbarProps {
  group: Group | null;
  users: User[] | null;
  isLoading: boolean;
  error: unknown | null;
  setShowAddExpenseForm: React.Dispatch<React.SetStateAction<boolean>>;
  showAddExpenseForm: boolean;
  setShowSettleUpForm: React.Dispatch<React.SetStateAction<boolean>>;
  exportExpensesToExcel: () => void;
  setDefaultUserId: React.Dispatch<React.SetStateAction<string>>;
}

const GroupNavbar: React.FC<GroupNavbarProps> = ({
  group,
  users,
  isLoading,
  error,
  setShowAddExpenseForm,
  showAddExpenseForm,
  setShowSettleUpForm,
  exportExpensesToExcel,
  setDefaultUserId,
}) => {
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const openExportModal = () => setShowExportModal(true);
  const closeExportModal = () => setShowExportModal(false);

  const handleExportExpenses = () => {
    exportExpensesToExcel();
    closeExportModal();
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = event.target.value;
    setDefaultUserId(selectedUserId);
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <nav className='group-navbar'>

      <div className='default-user-container'>
          <h5 className='default-user-title'>Default User</h5>
          <select onChange={handleUserChange}>
            {group?.members.map((member) => {
              if (users) {
                const memberName = getNameFromId(member._id, users);
                return <option key={member._id} value={member._id}>{memberName}</option>;
              }
              return <option>Missing users</option>;
            })}
          </select>
      </div>

      <div className='group-navbar-container'>
        <h1>{group?.name}</h1>
        <div className='group-navbar-button-container'>
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