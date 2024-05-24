import { useEffect, useState } from "react";
import { Group, User } from "./group/GroupComponent"
import GroupList from "./group/GroupList";
import { fetchAllUsers, fetchAllGroups, fetchUserById, postGroup, deleteGroupById } from "../api/api";
import Button from "./general/Button";
import AddGroupForm from "./group/AddGroupForm";

const Home = () => {
  const [groupsData, setGroupsData] = useState<Group[] | null>([]);
  const [users, setUsers] = useState<User[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [showAddGroupForm, setShowAddGroupForm] = useState<boolean>(false);

  const handleAddGroup = async (group: Group) => {
    console.log("Adding group: ", group);
  
    try {
      await postGroup(group); // post group to server
      setGroupsData((prevGroupsData) => prevGroupsData ? [...prevGroupsData, group] : [group]);
    } catch (error) {
      console.error("Error posting group: ", error);
    }
  };

  const handleDeleteGroup = async (group: Group) => {
    console.log("Deleting group: ", group.name);
    try {
      if (!group._id) {
        console.log("Group id does not exist");
      }
      else {
        await deleteGroupById(group._id); // delete group from server
        setGroupsData((prevGroupsData) => {
          if (!prevGroupsData) return null;
          return prevGroupsData?.filter((prevGroup) => group._id !== prevGroup._id); // filter out removed group
        });
      }
    } catch (error) {
      console.error("Error deleting group: ", error);
    }
  };

  // fetch groupsData and use memberIds to fetch users
  const fetchData = async () => {
    try {
      const groupsData = await fetchAllGroups();
      setGroupsData(groupsData);

      const users = await fetchAllUsers();
      setUsers(users);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching groups data: ', error);
      setError(error);
      setIsLoading(false);
    } 
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <GroupList groups={groupsData} onDeleteGroup={handleDeleteGroup} />
      <Button
        label={showAddGroupForm ? 'Cancel' : 'Add Group'}
        onClick={() => setShowAddGroupForm(!showAddGroupForm)}
      />
      {showAddGroupForm && <AddGroupForm  onAddGroup={handleAddGroup} users={users || []}/> }
    </>
  )
}
export default Home;