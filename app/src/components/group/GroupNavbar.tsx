import Button from '../general/Button'
import "../../styles/components/group/GroupNavbar.css"
import { useState } from 'react';
import ExportModal from '../expense/ExportModal';
import { getNameFromId } from '../../utils/utils';
import { importExpensesFromExcel } from '../../utils/importExcel';
import { useGroupContext } from '../../context/GroupContext';

interface GroupNavbarProps {
  setShowAddExpenseForm: React.Dispatch<React.SetStateAction<boolean>>;
  showAddExpenseForm: boolean;
  setShowSettleUpForm: React.Dispatch<React.SetStateAction<boolean>>;
  exportExpensesToExcel: () => void;
  defaultUserId: string;
  setDefaultUserId: React.Dispatch<React.SetStateAction<string>>;
}

const GroupNavbar: React.FC<GroupNavbarProps> = ({
  setShowAddExpenseForm,
  showAddExpenseForm,
  setShowSettleUpForm,
  exportExpensesToExcel,
  defaultUserId,
  setDefaultUserId,
}) => {
  const { group, groupUsers, isLoading, isError, setUnsettledExpenses } = useGroupContext();
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const openExportModal = () => setShowExportModal(true);
  const closeExportModal = () => setShowExportModal(false);

  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const openImportModal = () => setShowImportModal(true);
  const closeImportModal = () => setShowImportModal(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExportExpenses = () => {
    exportExpensesToExcel();
    closeExportModal();
  };

  const handleImportExpenses = async () => {
    if (selectedFile && group && groupUsers) {
      try {
        const importedExpenses = await importExpensesFromExcel(selectedFile, group, groupUsers);
        if (importExpensesFromExcel.length > 0) {
          // update unsettledExpenses locally
          setUnsettledExpenses(prevExpenses => [...(prevExpenses || []), ...importedExpenses]);
        }
        else {
          console.log("No expenses were imported.");
        }
      } catch (error) {
        console.error("Failed to import expenses: ", error);
      }
    }
    else {
      console.error("handleImportExpenses: missing selectedFile, group, users, and group id");
    }
    closeImportModal();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = event.target.value;
    setDefaultUserId(selectedUserId);
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error getting data</p>;

  return (
    <nav className='group-navbar'>

      <div className='default-user-container'>
          <h5 className='default-user-title'>Default User</h5>
          <select value={defaultUserId} onChange={handleUserChange}>
            {group?.members.map((member) => {
              if (groupUsers) {
                const memberName = getNameFromId(member._id, groupUsers);
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
          <Button
            label='Import'
            onClick={() => {
              openImportModal();
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

      <ExportModal
        isOpen={showImportModal}
        onClose={closeImportModal}
        onConfirm={handleImportExpenses}
        title="Import Expenses"
      >
        <div>
          <p>Please select .xlsx or .xls file</p>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange}/>
        </div>
      </ExportModal>

    </nav>
  )
}

export default GroupNavbar;