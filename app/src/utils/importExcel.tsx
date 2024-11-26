import * as XLSX from 'xlsx';
import { getIdFromName } from './utils';
import config from '../../config.json'
import { Group, User, Expense, Participant } from '../types/types';

export const importExpensesFromExcel = async (file: File, group: Group, users: User[]) => {
  const reader = new FileReader();

  return new Promise<Expense[]>((resolve, reject) => {
    reader.onload = async (e) => {
      // convert to Uint8Array so that XLSX can work with data
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      try {
        const importedExpenses = await processImportedExpenses(jsonData, group, users);

        // send `importedExpenses` to your backend or update your state
        const response = await saveImportedExpenses(importedExpenses);

        if (response.insertedCount > 0) {
          const expensesWithIds = importedExpenses.map((expense, index) => ({
            ...expense,
            _id: response.insertedIds[index.toString()],
          }));
          resolve(expensesWithIds);
        }
        else {
          console.error("saveImportedExpenses failed, no inserted expenses to database");
          resolve([]);
        }
      } catch (error) {
        console.error("Error processing imported expenses: ", error);
        alert("Error processing expenses: " + error);
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file); // calls onload
  });

};

// process imported data from JSON to Expense[]
export const processImportedExpenses = async (jsonData: any[], group: Group, users: User[]) => {
  const currentDate = new Date();
  let timeIncrement = 0;

  // filter out invalid items with undefined title or amount
  const validData = jsonData.filter((item) => {
    if (item.title === undefined || item.title === undefined) {
      return false;
    }
    return true;
  })

  // convert importedExpenses to Expense[] type and send expenses to backend
  const importedExpenses: Expense[] = validData.map((item) => {
    const settled = item.settled !== undefined ? item.settled : false; // default settled to false
    const type = item.type !== undefined ? item.type : 'normal'; // default type to normal

    // validate group id
    if (!group._id) {
      throw new Error("Group ID is missing. Cannot process expenses without valid group ID.");
    }

    // validate payerId
    const payerId = getIdFromName(item.payerName, users);
    if (payerId === 'Unknown') {
      throw new Error(`Payer ID is missing for the payer name: ${item.payerName}. Cannot process expense.`);
    }

    // validate amount
    let amountNum: number = item.amount;
    let amountString: string = amountNum.toString();
    amountString = amountString.replace(/[^0-9.]/g, '');
    amountNum = parseFloat(amountString);
    if (isNaN(amountNum)) {
      throw new Error(`Invalid amount: ${item.amount}`);
    }
    amountNum = parseFloat(amountNum.toFixed(2));

    // convert participants to Participant[]
    const participantsArray: Participant[] = item.participants
      .split(', ')
      .map((name: string) => {
        const memberId = getIdFromName(name, users);

        if (memberId === 'Unknown') {
          throw new Error(`Participant "${name}" is not a member of the group`);
        }

        return {
          memberId,
          share: 0, // placeholder
        }
      });
    const participantsCount = participantsArray.length;

    // validate and process date
    let dateString = item.date;

    // not valid date string format
    if (typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
      let year = currentDate.getFullYear();
      let month = currentDate.getMonth() + 1; // JS months are 0-indexed
      let day = currentDate.getDate();
      let hour = 0, minute = 0, second = 0;

      if (typeof dateString === 'string') {
        // special case `MM.DD` format
        if (/^\d{1,2}\.\d{1,2}$/.test(dateString)) {
          const [mm, dd] = dateString.split('.').map(Number);
          month = mm;
          day = dd;
        }
        else {
          const dateParts = dateString.split(/[-\s:.]/); // Split into parts by `-`, space, '.', or `:`

          // assign date parts if present
          if (dateParts.length >= 1 && dateParts[0].length === 4) year = parseInt(dateParts[0]); // YYYY
          if (dateParts.length >= 2) month = parseInt(dateParts[1]); // MM
          if (dateParts.length >= 3) day = parseInt(dateParts[2]); // DD
          if (dateParts.length >= 4) hour = parseInt(dateParts[3]); // HH
          if (dateParts.length >= 5) minute = parseInt(dateParts[4]); // mm
          if (dateParts.length >= 6) second = parseInt(dateParts[5]); // ss
        }
      }

      // inc seconds to ensure unique timestamps
      second += timeIncrement++;
      if (second >= 60) {
        second -= 60;
        minute += 1;
      }
      if (minute >= 60) {
        minute -= 60;
        hour += 1;
      }

      dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    }

    return {
      groupId: group._id,
      title: item.title,
      amount: amountNum,
      date: dateString,
      payerId: payerId,
      participants: participantsArray.map((participant: Participant) => ({
        ...participant,
        share: 100 / participantsCount,
      })),
      settled: settled,
      type: type,
    };
  });

  return importedExpenses;
};

// post Expense[] data to backend or update state
// return data if successful
export const saveImportedExpenses = async (importedExpenses: Expense[]) => {
  const url = config.serverUrl + '/expenses/import';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(importedExpenses),
    });

    if (!response.ok) {
      console.error("Failed to import expenses");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error importing expenses:", error);
  }
};