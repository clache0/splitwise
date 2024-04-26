import { Group } from './Group'

type GroupNavbarProps = {
  group: Group | null;
  loading: boolean;
  error: Error | null;
}

const GroupNavbar: React.FC<GroupNavbarProps> = ({ group, loading, error }) => {

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Group Navbar</h1>
      <h1>Group Name: {group?.name}</h1>
    </>
  )
}

export default GroupNavbar;