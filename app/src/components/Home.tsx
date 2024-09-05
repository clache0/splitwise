import { useEffect, useState } from "react";
import { Group, User } from "./group/GroupComponent"
import GroupList from "./group/GroupList";
import { fetchAllUsers, fetchAllGroups, postGroup, deleteGroupById, patchGroup, fetchExpensesByGroupId } from "../api/api";
import Button from "./general/Button";
import AddGroupForm from "./group/AddGroupForm";
import Modal from "./general/Modal";
import "../styles/components/Home.css"
import { checkUnsettledExpenses } from "../api/balanceUtils";

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
    const groupExpenses = await fetchExpensesByGroupId(updatedGroup._id!);
    const check = checkUnsettledExpenses(updatedGroup, users!, groupExpenses);

    if (!updatedGroup || !check) {
      alert("Cannot update group. Some members have unsettled expenses or remaining balance.");
      return;
    }

    try {
      await patchGroup(updatedGroup); // post group to server
      setGroupsData(await fetchAllGroups());
    } catch (error) {
      console.error("Error updating expense: ", error);
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) {
      alert("No group to delete");
      return;
    }

    const groupExpenses = await fetchExpensesByGroupId(groupToDelete._id!);
    const check = checkUnsettledExpenses(groupToDelete, users!, groupExpenses);

    if (!check) {
      alert("Cannot delete group. Some members have unsettled expenses or remaining balance.");
      setShowDeleteModal(false);
      return;
    }

    if (groupToDelete._id) {
      try {
        await deleteGroupById(groupToDelete._id); // delete group from server
        setGroupsData(await fetchAllGroups());
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

  // TODO: if groupsData is empty return a message instead of GroupList
  return (
    <div className="home-container">
      <Button
        label={showAddGroupForm ? 'Cancel' : 'Add Group'}
        onClick={() => setShowAddGroupForm(!showAddGroupForm)}
      />

      <div className="home-group-list-container">
        {groupsData && groupsData.length !== 0 ?
          <GroupList
            groups={groupsData}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={openDeleteModal}
            users={users}
          /> : <p>Create a group!</p>
        }
      </div>

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
    </div>
  )
}
export default Home;