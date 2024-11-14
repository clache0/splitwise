import GroupNavbar from "./GroupNavbar"
import { useEffect, useState } from 'react';
import ExpenseList from "../expense/ExpenseList";
import { postExpense, deleteExpenseById, patchExpense } from "../../api/apiExpense";
import AddExpenseForm from "../expense/AddExpenseForm";
import Modal from "../general/Modal";
import GroupBalances from "./GroupBalances";
import "../../styles/components/group/GroupComponent.css"
import SettleUpForm from "../expense/SettleUpForm";
import * as XLSX from 'xlsx';
import { getNameFromId } from "../../utils/utils";
import { checkUnsettledExpenses } from "../../utils/balanceUtils";
import { Expense } from "../../types/types";
import { useGroupContext } from "../../context/GroupContext";

const GroupComponent = () => {
  const { group, groupUsers, groupExpenses, setGroupExpenses } = useGroupContext();
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[] | []>([]);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState<boolean>(false);
  const [showSettleUpForm, setShowSettleUpForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [defaultUserId, setDefaultUserId] = useState<string>("");
  const [isCheckSettleUp, setIsCheckSettleUp] = useState<boolean>(false);

  // set defaultUserId
  // TODO: save defaultUserId in localStorage
  useEffect(() => {
    if (group && group.members) {
      setDefaultUserId(group?.members[0]._id);
    }
  }, [group]);

  const handleAddExpense = async (expense: Expense) => {
    try {
      const expenseId = await postExpense(expense); // post expense to server
      const newExpense = { ...expense, _id: expenseId };
      setGroupExpenses((prevExpenses) => [...prevExpenses, newExpense]);
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
    if (!expenseToDelete) {
      alert("No group to delete");
      return;
    }

    if (!expenseToDelete._id) {
      alert("Expense ID does not exist");
      return;
    }

    try {
      await deleteExpenseById(expenseToDelete._id);
      setGroupExpenses((prevGroupExpenses) =>
        prevGroupExpenses?.filter((prevExpense) => expenseToDelete._id !== prevExpense._id)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  // post settleUp expense and update groupExpenses
  const handleSettleUp = async(expense: Expense) => {
    try {
      const expenseId = await postExpense(expense); // post settle up expense to server
      const newExpense = { ...expense, _id: expenseId };
      await setGroupExpenses((prevExpenses) => [...prevExpenses, newExpense]); // update group expenses locally
      setIsCheckSettleUp(!isCheckSettleUp); // trigger flag to check settle up flag in expenses
    } catch (error) {
      console.error("Error settling up expense: ", error);
    }
  };

  // handleSettleUp updates groupExpenses asynchronously
  useEffect(() => {
    if (groupExpenses && groupExpenses.length > 0) {
      settleExpenses(groupExpenses);
    }
  }, [isCheckSettleUp]);

  // check to mark expenses as settled locally and on server
  const settleExpenses = async (groupExpenses: Expense[]) => {
    if (!checkUnsettledExpenses(group!, groupUsers!, groupExpenses)) {
      return;
    }

    const updatedExpenses = [...groupExpenses];
    for (const expense of updatedExpenses) {
      if (!expense.settled) {
        expense.settled = true; // update local expense
        await patchExpense(expense); // update server expense
      }
    }
    setGroupExpenses(updatedExpenses);
  }

  const handleFilteredExpensesChange = (newData: Expense[] | []) => {
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
    if (!filteredExpenses || !groupUsers) return;

    const processedExpenses = filteredExpenses.map((expense) => {
      const { _id, groupId, payerId, participants, ...rest } = expense;
      return {
        ...rest,
        payerName: getNameFromId(payerId, groupUsers),
        participants: participants.map(
          (participant) => getNameFromId(participant.memberId, groupUsers))
          .join(", "),
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
        setShowAddExpenseForm={setShowAddExpenseForm} 
        showAddExpenseForm={showAddExpenseForm} 
        setShowSettleUpForm={setShowSettleUpForm} 
        exportExpensesToExcel={exportExpensesToExcel}
        setDefaultUserId={setDefaultUserId}
      />

      <div className="group-content">
        {groupExpenses && groupUsers &&
          <GroupBalances
            groupExpenses={groupExpenses}
            users={groupUsers}
          />
        }

        <ExpenseList
          onUpdateExpense={handleUpdateExpense}
          onDeleteExpense={openDeleteModal}
          onFilteredExpensesChange={handleFilteredExpensesChange}
        />
      </div>

      { showAddExpenseForm && 
        <AddExpenseForm 
          onSubmit={handleAddExpense} 
          onShowForm={setShowAddExpenseForm}
          defaultUserId={defaultUserId}
        /> 
      }

      { showSettleUpForm && group?._id &&
        <SettleUpForm 
          onSubmit={handleSettleUp} 
          onShowForm={setShowSettleUpForm}
          groupId={group._id}
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