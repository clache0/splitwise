import { Group } from './GroupComponent'
import Button from '../general/Button'

interface GroupNavbarProps {
  group: Group | null;
  isLoading: boolean;
  error: unknown | null;
  setShowAddExpenseForm: React.Dispatch<React.SetStateAction<boolean>>;
  showAddExpenseForm: boolean;
}

const GroupNavbar: React.FC<GroupNavbarProps> = ({ group, isLoading, error, setShowAddExpenseForm, showAddExpenseForm }) => {

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <nav>
      <h1>Group Name: {group?.name}</h1>
      <Button
        label='Add Expense'
        onClick={() => {
          console.log('Add expense clicked');
          setShowAddExpenseForm(!showAddExpenseForm);
        }}
      />
      <Button
        label='Settle Up'
        onClick={() => console.log('Settle up clicked')}
      />
    </nav>
  )
}

export default GroupNavbar;