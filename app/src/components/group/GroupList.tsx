import { Link } from "react-router-dom";
import { Group } from "./GroupComponent";
import Button from "../general/Button";

interface GroupListProps {
  groups: Group[] | null;
  onDeleteGroup: (group: Group) => void;
}
const GroupList: React.FC<GroupListProps> = ({ groups, onDeleteGroup }) => {
  
  if (!groups) {
    return <div>Loading Group List...</div>
  }

  const groupList = groups ? groups.map((group, index) => (
    <li key={group._id || index}>
      <Link to={`/group/${group._id}`}>{group.name}</Link>
      <Button
        label='Delete'
        onClick={() => { onDeleteGroup(group) }}
      />
    </li>
  )) : null;

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