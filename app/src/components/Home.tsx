import { useState } from "react";
import GroupList from "./group/GroupList";
import { postGroup, deleteGroupById, patchGroup } from "../api/apiGroup";
import { fetchUnsettledExpensesByGroupId } from "../api/apiExpense";
import Button from "./general/Button";
import AddGroupForm from "./group/AddGroupForm";
import Modal from "./general/Modal";
import "../styles/components/Home.css"
import { checkUnsettledExpenses } from "../utils/balanceUtils";
import { useAppData } from "../context/AppDataContext";
import { Group } from "../types/types";

const Home = () => {
  const { groups, isLoading, isError, setGroups } = useAppData();
  const [showAddGroupForm, setShowAddGroupForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  const handleAddGroup = async (group: Group) => {
    try {
      const groupId = await postGroup(group); // post group to server
      const newGroup = { ...group, _id: groupId }
      setGroups((prevGroups) => [...prevGroups, newGroup]); // update local groups
    } catch (error) {
      console.error("Error posting group: ", error);
    }
  };

  const handleUpdateGroup = async (updatedGroup: Group) => {
    const unsettledExpenses = await fetchUnsettledExpensesByGroupId(updatedGroup._id!);
    const check = checkUnsettledExpenses(unsettledExpenses);

    if (!updatedGroup || !check) {
      alert("Cannot update group. Some members have unsettled expenses or remaining balance.");
      return;
    }

    try {
      await patchGroup(updatedGroup); // post group to server
      setGroups((prevGroups) => 
        prevGroups.map((group) =>
          group._id === updatedGroup._id ? updatedGroup : group
        )
      );
    } catch (error) {
      console.error("Error updating expense: ", error);
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) {
      alert("No group to delete");
      return;
    }

    if (!groupToDelete._id) {
      alert("Group ID does not exist");
      return;
    }

    const unsettledExpenses = await fetchUnsettledExpensesByGroupId(groupToDelete._id!);
    const check = checkUnsettledExpenses(unsettledExpenses);

    if (!check) {
      alert("Cannot delete group. Some members have unsettled expenses or remaining balance.");
      setShowDeleteModal(false);
      return;
    }

    try {
      await deleteGroupById(groupToDelete._id); // delete group from database
      setGroups((prevGroups) => 
        prevGroups.filter((group) => group._id !== groupToDelete._id)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting group: ", error);
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

  if (isLoading) return <div>Content is loading</div>;
  
  if (isError) return <div>Error loading content</div>;

  return (
    <div className="home-container">
      <Button
        label={showAddGroupForm ? 'Cancel' : 'Add Group'}
        onClick={() => setShowAddGroupForm(!showAddGroupForm)}
      />

      <div className="home-group-list-container">
        {groups && groups.length !== 0 ?
          <GroupList
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={openDeleteModal}
          /> : <p>Create a group!</p>
        }
      </div>

      { showAddGroupForm && 
        <AddGroupForm  
          onSubmit={handleAddGroup}
          onShowForm={setShowAddGroupForm}
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