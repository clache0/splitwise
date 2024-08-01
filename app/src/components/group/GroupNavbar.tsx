import { Group } from './GroupComponent'
import Button from '../general/Button'
import "../../styles/components/group/GroupNavbar.css"

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
            exportExpensesToExcel();
          }}
          backgroundColor='var(--light-gray)'
        />
      </div>
    </nav>
  )
}

export default GroupNavbar;