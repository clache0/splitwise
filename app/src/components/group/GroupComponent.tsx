import GroupNavbar from "./GroupNavbar"
import { useEffect, useState } from 'react';
import ExpenseList from "../expense/ExpenseList";
import { fetchGroupById, fetchExpensesByGroupId, fetchUserById, postExpense, deleteExpenseById } from "../../api/api";
import AddExpenseForm from "../expense/AddExpenseForm";
import { useParams } from "react-router-dom";
import Modal from "../general/Modal";
import GroupBalances from "./GroupBalances";

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
};

export interface Member {
  _id: string;
};

export interface Group {
  _id?: string;
  name: string;
  members: Member[];
};

export interface Participant {
  memberId: string;
  share: number;
}

export interface Expense {
  _id?: string;
  groupId: string;
  title: string;
  amount: number;
  date: string;
  payerId: string;
  participants: Participant[];
}

const GroupComponent = () => {
  const { groupId } = useParams() as { groupId: string};
  const [group, setGroup] = useState<Group | null>(null);
  const [groupExpenses, setGroupExpenses] = useState<Expense[] | null>([]);
  const [users, setUsers] = useState<User[] | null>([]); // group members including first and last name
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const fetchData = async () => {
    try {
      const groupData = await fetchGroupById(groupId);
      const users = await Promise.all(groupData.members.map((member: Member) => fetchUserById(member._id)));
      const groupExpensesData = await fetchExpensesByGroupId(groupId);
      setGroup(groupData);
      setGroupExpenses(groupExpensesData);
      setUsers(users);
    } catch (error) {
      console.error('Error fetching group data: ', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const handleAddExpense = async (expense: Expense) => {
    console.log("Adding expense: ", expense);
    try {
      await postExpense(expense); // post expense to server
      setGroupExpenses((prevExpenses) => prevExpenses ? [...prevExpenses, expense] : [expense]);
    } catch (error) {
      console.error("Error posting expense: ", error);
    }
  };

  const handleDeleteExpense = async () => {
    if (expenseToDelete && expenseToDelete._id) {
      console.log("Deleting expense: ", expenseToDelete);
      try {
        await deleteExpenseById(expenseToDelete._id);
        setGroupExpenses((prevGroupExpenses) => {
          if(!prevGroupExpenses) return null;
          return prevGroupExpenses?.filter((prevExpense) => expenseToDelete._id !== prevExpense._id);
        });
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting expense: ", error);
      }
    }
};

  const openDeleteModal = (expense: Expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setExpenseToDelete(null);
  };

  return (
    <>
      <GroupNavbar 
        group={group} 
        isLoading={isLoading} 
        error={error} 
        setShowAddExpenseForm={setShowAddExpenseForm} 
        showAddExpenseForm={showAddExpenseForm} 
      />

      { showAddExpenseForm && 
        <AddExpenseForm 
          onAddExpense={handleAddExpense} 
          onShowForm={setShowAddExpenseForm}
          group={group} 
          users={users}
        /> 
      }

      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteExpense}
        title="Confirm Delete"
      >
        Are you sure you want to delete this expense?
      </Modal>

      <ExpenseList groupExpenses={groupExpenses} onDeleteExpense={openDeleteModal} users={users} />

      {groupExpenses && users &&
        <GroupBalances
          groupExpenses={groupExpenses}
          users={users}
        />
      }
    </>
  )
};

export default GroupComponent;