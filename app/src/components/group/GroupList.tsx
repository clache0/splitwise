import GroupComponent from "./GroupComponent";
import { Group } from "./GroupComponent";

interface GroupListProps {
  groups: Group[] | null;
}
const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  
  const groupComponents = groups ?
    groups?.map((group, index) => {
      const groupId = group._id || index.toString();
      return <GroupComponent key={groupId} groupId={groupId} />
    }) : null;

  return (
    <>
      <h2>Group List</h2>
      {groupComponents}
    </>
  );
};

export default GroupList;