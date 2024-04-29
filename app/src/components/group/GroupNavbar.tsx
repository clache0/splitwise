import { Group } from './Group'
import Button from '../general/Button'

type GroupNavbarProps = {
  group: Group | null;
  loading: boolean;
  error: Error | null;
}

const GroupNavbar: React.FC<GroupNavbarProps> = ({ group, loading, error }) => {

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <nav>
      <h1>Group Name: {group?.name}</h1>
      <Button
        label='Add Expense'
        onClick={() => console.log('Add expense clicked')}
      />
      <Button
        label='Settle Up'
        onClick={() => console.log('Settle up clicked')}
      />
    </nav>
  )
}

export default GroupNavbar;