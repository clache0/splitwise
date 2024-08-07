import { useEffect, useState } from "react";
import { Group, User } from "./group/GroupComponent"
import GroupList from "./group/GroupList";
import { fetchAllUsers, fetchAllGroups, postGroup, deleteGroupById, patchGroup } from "../api/api";
import Button from "./general/Button";
import AddGroupForm from "./group/AddGroupForm";
import Modal from "./general/Modal";
import "../styles/components/Home.css"

const Home = () => {
  const [groupsData, setGroupsData] = useState<Group[] | null>([]);
  const [users, setUsers] = useState<User[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [showAddGroupForm, setShowAddGroupForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  const handleAddGroup = async (group: Group) => {
    try {
      await postGroup(group); // post group to server
      setGroupsData(await fetchAllGroups());
    } catch (error) {
      console.error("Error posting group: ", error);
    }
  };

  const handleUpdateGroup = async (updatedGroup: Group) => {
    try {
      await patchGroup(updatedGroup); // post group to server
      setGroupsData(await fetchAllGroups());
    } catch (error) {
      console.error("Error updating expense: ", error);
    }
  };

  const handleDeleteGroup = async () => {

    if (groupToDelete && groupToDelete._id) {
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
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setGroupToDelete(null);
  };

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
      <Button
        label={showAddGroupForm ? 'Cancel' : 'Add Group'}
        onClick={() => setShowAddGroupForm(!showAddGroupForm)}
      />

      <GroupList 
        groups={groupsData}
        onUpdateGroup={handleUpdateGroup}
        onDeleteGroup={openDeleteModal}
        users={users}
      />

      { showAddGroupForm && 
        <AddGroupForm  
          onSubmit={handleAddGroup}
          onShowForm={setShowAddGroupForm}
          users={users || []}
        /> 
      }

      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteGroup}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this group?</p>
        <p>Group expenses will be deleted.</p>
      </Modal>
    </>
  )
}
export default Home;