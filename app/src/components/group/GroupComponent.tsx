import GroupNavbar from "./GroupNavbar"
import { useEffect, useState } from 'react';
import ExpenseList from "../expense/ExpenseList";
import { fetchExpensesByGroupId, postExpense, deleteExpenseById, patchExpense } from "../../api/apiExpense";
import { fetchUserById } from "../../api/apiUser";
import { fetchGroupById } from "../../api/apiGroup";
import AddExpenseForm from "../expense/AddExpenseForm";
import { useParams } from "react-router-dom";
import Modal from "../general/Modal";
import GroupBalances from "./GroupBalances";
import "../../styles/components/group/GroupComponent.css"
import SettleUpForm from "../expense/SettleUpForm";
import * as XLSX from 'xlsx';
import { getNameFromId } from "../../api/utils";
import { checkUnsettledExpenses } from "../../api/balanceUtils";

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
  settled: boolean;
}

const GroupComponent = () => {
  const { groupId } = useParams() as { groupId: string};
  const [group, setGroup] = useState<Group | null>(null);
  const [groupExpenses, setGroupExpenses] = useState<Expense[] | null>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[] | null>([]);
  const [users, setUsers] = useState<User[] | null>([]); // group members including first and last name
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState<boolean>(false);
  const [showSettleUpForm, setShowSettleUpForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // fetch group, groupExpenses, users
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

  // re-fetch group, groupExpenses, users when groupId changes
  useEffect(() => {
    fetchData();
  }, [groupId]);

  const handleAddExpense = async (expense: Expense) => {
    try {
      await postExpense(expense); // post expense to server
      setGroupExpenses(await fetchExpensesByGroupId(expense.groupId));
    } catch (error) {
      console.error("Error posting expense: ", error);
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      await patchExpense(updatedExpense); // post expense to server
      setGroupExpenses((prevExpenses) => 
        prevExpenses!.map((expense) =>
          expense._id === updatedExpense._id ? updatedExpense : expense
        )
      );
    } catch (error) {
      console.error("Error updating expense: ", error);
    }
  };

  const handleDeleteExpense = async () => {
    if (expenseToDelete && expenseToDelete._id) {
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

  // post settleUp expense and update groupExpenses
  const handleSettleUp = async(expense: Expense) => {
    try {
      await postExpense(expense); // post settle up expense to server
      const updatedExpenses = await fetchExpensesByGroupId(expense.groupId);
      await setGroupExpenses(updatedExpenses); // update group expenses locally
    } catch (error) {
      console.error("Error settling up expense: ", error);
    }
  };

  // handleSettleUp updates groupExpenses asynchronously
  useEffect(() => {
    if (groupExpenses && groupExpenses.length > 0) {
      settleExpenses(groupExpenses); // check to mark expenses as settled locally and on server
    }
  }, [groupExpenses]);

  const settleExpenses = async (groupExpenses: Expense[]) => {
    if (!checkUnsettledExpenses(group!, users!, groupExpenses)) {
      return;
    }

    for (const expense of groupExpenses) {
      if (!expense.settled) {
        expense.settled = true; // update local expense
        await patchExpense(expense);
      }
    }
  }

  const handleFilteredExpensesChange = (newData: Expense[] | null) => {
    setFilteredExpenses(newData);
  }

  const openDeleteModal = (expense: Expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setExpenseToDelete(null);
  };

  const exportExpensesToExcel = () => {
    if (!filteredExpenses || !users) return;

    const processedExpenses = filteredExpenses.map((expense) => {
      const { _id, groupId, payerId, participants, ...rest } = expense;
      return {
        ...rest,
        payerName: getNameFromId(payerId, users),
        participants: participants.map((participant) => getNameFromId(participant.memberId, users)).join(", "),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(processedExpenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, `Group_${group?.name}_Expenses.xlsx`);
  }

  return (
    <div className="group-component">
      <GroupNavbar 
        group={group} 
        isLoading={isLoading} 
        error={error} 
        setShowAddExpenseForm={setShowAddExpenseForm} 
        showAddExpenseForm={showAddExpenseForm} 
        setShowSettleUpForm={setShowSettleUpForm} 
        exportExpensesToExcel={exportExpensesToExcel}
      />

      <div className="group-content">
        {groupExpenses && users &&
          <GroupBalances
            groupExpenses={groupExpenses}
            users={users}
          />
        }

        <ExpenseList
          group={group}
          groupExpenses={groupExpenses}
          onUpdateExpense={handleUpdateExpense}
          onDeleteExpense={openDeleteModal}
          users={users}
          onFilteredExpensesChange={handleFilteredExpensesChange}
        />
      </div>

      { showAddExpenseForm && 
        <AddExpenseForm 
          onSubmit={handleAddExpense} 
          onShowForm={setShowAddExpenseForm}
          group={group} 
          users={users}
        /> 
      }

      { showSettleUpForm && 
        <SettleUpForm 
          onSubmit={handleSettleUp} 
          onShowForm={setShowSettleUpForm}
          users={users!}
          groupId={groupId} 
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


    </div>
  )
};

export default GroupComponent;