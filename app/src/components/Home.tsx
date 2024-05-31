import { useEffect, useState } from "react";
import { Group, User } from "./group/GroupComponent"
import GroupList from "./group/GroupList";
import { fetchAllUsers, fetchAllGroups, postGroup, deleteGroupById } from "../api/api";
import Button from "./general/Button";
import AddGroupForm from "./group/AddGroupForm";
import Modal from "./general/Modal";

const Home = () => {
  const [groupsData, setGroupsData] = useState<Group[] | null>([]);
  const [users, setUsers] = useState<User[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [showAddGroupForm, setShowAddGroupForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  const handleAddGroup = async (group: Group) => {
    console.log("Adding group: ", group);
  
    try {
      await postGroup(group); // post group to server
      setGroupsData((prevGroupsData) => prevGroupsData ? [...prevGroupsData, group] : [group]);
    } catch (error) {
      console.error("Error posting group: ", error);
    }
  };

  const handleDeleteGroup = async () => {

    if (groupToDelete && groupToDelete._id) {
      console.log("Deleting group: ", groupToDelete.name);
      try {
        await deleteGroupById(groupToDelete._id); // delete group from server
        setGroupsData((prevGroupsData) => {
          if (!prevGroupsData) return null;
          return prevGroupsData?.filter((prevGroup) => groupToDelete._id !== prevGroup._id); // filter out removed group
        });
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting group: ", error);
      }
    }
};

  const openDeleteModal = (group: Group) => {
    setGroupToDelete(group);
    setShowDeleteModal(true);
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setGroupToDelete(null);
  }

  // fetch groupsData and use memberIds to fetch users
  const fetchData = async () => {
    try {
      const groupsData = await fetchAllGroups();
      setGroupsData(groupsData);

      const users = await fetchAllUsers();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching groups data: ', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div>Content is loading</div>;
  
  if (error) return <div>Error loading content</div>;

  return (
    <>
      <GroupList groups={groupsData} onDeleteGroup={openDeleteModal} />
      <Button
        label={showAddGroupForm ? 'Cancel' : 'Add Group'}
        onClick={() => setShowAddGroupForm(!showAddGroupForm)}
      />
      {showAddGroupForm && <AddGroupForm  onAddGroup={handleAddGroup} users={users || []}/> }

      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteGroup}
        title="Confirm Delete"
      >
        Are you sure you want to delete this group?
      </Modal>
    </>
  )
}
export default Home;