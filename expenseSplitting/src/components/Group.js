import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { getDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const Group = ({ route }) => {
  const { groupTitle } = route.params;
  const [tab, setTab] = useState("Expenses");
  const [allParticipants, setAllParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [reimbursements, setReimbursements] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const groupDoc = await getDoc(doc(collection(db, "groups"), groupTitle));
      const participants = groupDoc.data().participants;
      setAllParticipants(participants);
    })();
    const expensesCollection = collection(db, "groups", groupTitle, "expenses");
    onSnapshot(expensesCollection, (snapshot) => {
      const expensesList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const sortedExpensesList = expensesList.sort(
        (a, b) => b.dateTimeAdded - a.dateTimeAdded
      );
      setExpenses(sortedExpensesList);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setTab("Expenses");
    }, [])
  );

  const changeToBalances = () => {
    setTab("Balances");
    const balancesObj = allParticipants.reduce((acc, participant) => {
      acc[participant] = 0;
      return acc;
    }, {});
    for (const expense of expenses) {
      balancesObj[expense.paidBy] += Number(expense.amount);
      for (const participant of expense.participants) {
        balancesObj[participant] -=
          Number(expense.amount) / expense.participants.length;
      }
    }
    setBalances(balancesObj);
    const creditors = [];
    const debtors = [];
    Object.entries(balancesObj).map(([participant, balance]) => {
      if (balance > 0) creditors.push({ participant, amount: balance });
      else if (balance < 0) debtors.push({ participant, amount: -balance });
    });
    const reimbursementsList = [];
    let creditorIndex = 0;
    let debtorIndex = 0;
    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];
      const amount = Math.min(creditor.amount, debtor.amount);
      reimbursementsList.push({
        from: debtor.participant,
        to: creditor.participant,
        amount: amount,
      });
      creditors[creditorIndex].amount -= amount;
      debtors[debtorIndex].amount -= amount;
      if (creditors[creditorIndex].amount === 0) creditorIndex++;
      if (debtors[debtorIndex].amount === 0) debtorIndex++;
    }
    setReimbursements(reimbursementsList);
  };

  return (
    <SafeAreaView>
      <View>
        <Text>{groupTitle}</Text>
        <TouchableOpacity onPress={() => setTab("Expenses")}>
          <Text>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeToBalances()}>
          <Text>Balances</Text>
        </TouchableOpacity>
        {tab === "Expenses" &&
          expenses.map((expense, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate("Expense", { expense })}
            >
              <Text>{expense.title}</Text>
              <Text>Paid by {expense.paidBy}</Text>
              <Text>${Number(expense.amount).toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        {tab === "Balances" && (
          <View>
            {Object.entries(balances).map(([participant, balance]) => (
              <View key={participant}>
                <Text>{participant}</Text>
                <Text>{balance.toFixed(2)}</Text>
              </View>
            ))}
            {reimbursements.map((reimbursement, index) => (
              <View key={index}>
                <Text>{reimbursement.from}</Text>
                <Text>{reimbursement.to}</Text>
                <Text>{reimbursement.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Group;
