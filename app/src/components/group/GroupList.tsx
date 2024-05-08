import { Link } from "react-router-dom";
import { Group } from "./GroupComponent";

interface GroupListProps {
  groups: Group[] | null;
}
const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  
  if (!groups) {
    return <div>Loading Group List...</div>
  }

  const groupList = groups.map((group) => (
    <li key={group._id}>
      <Link to={`/group/${group._id}`}>{group.name}</Link>
    </li>
  ));

  return (
    <>
      <h2>Group List</h2>
      <ul>
        {groupList}
      </ul>
    </>
  );
};

export default GroupList;