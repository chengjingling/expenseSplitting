import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
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
    const filteredReimbursementsList = reimbursementsList.filter(
      (reimbursement) => reimbursement.amount.toFixed(2) !== "0.00"
    );
    setReimbursements(filteredReimbursementsList);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.groupTitleText}>{groupTitle}</Text>
        <View style={styles.tabsRow}>
          <TouchableOpacity
            onPress={() => setTab("Expenses")}
            style={[
              styles.expensesTab,
              tab === "Expenses" ? styles.activeTab : styles.inactiveTab,
            ]}
          >
            <Text style={tab === "Expenses" && styles.activeText}>
              Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeToBalances()}
            style={[
              styles.balancesTab,
              tab === "Balances" ? styles.activeTab : styles.inactiveTab,
            ]}
          >
            <Text style={tab === "Balances" && styles.activeText}>
              Balances
            </Text>
          </TouchableOpacity>
        </View>
        {tab === "Expenses" &&
          (expenses.length === 0 ? (
            <Text style={styles.noExpensesText}>No expenses</Text>
          ) : (
            expenses.map((expense, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate("Expense", { expense })}
                style={styles.expenseButton}
              >
                <View>
                  <Text style={styles.largerText}>{expense.title}</Text>
                  <Text style={styles.paidByText}>
                    Paid by {expense.paidBy}
                  </Text>
                </View>
                <Text style={styles.largerText}>
                  ${Number(expense.amount).toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))
          ))}
        {tab === "Balances" && (
          <View>
            <Text style={styles.balancesText}>Balances</Text>
            {Object.entries(balances).map(([participant, balance]) => (
              <View key={participant} style={styles.balanceRow}>
                <Text style={styles.largerText}>{participant}</Text>
                <Text
                  style={[
                    balance.toFixed(2) === "0.00" ||
                    balance.toFixed(2) === "-0.00"
                      ? styles.zeroBalanceText
                      : balance > 0
                      ? styles.positiveBalanceText
                      : styles.negativeBalanceText,
                  ]}
                >
                  {balance.toFixed(2) === "0.00" ||
                  balance.toFixed(2) === "-0.00"
                    ? "$0.00"
                    : balance > 0
                    ? `+$${balance.toFixed(2)}`
                    : `-$${Math.abs(balance).toFixed(2)}`}
                </Text>
              </View>
            ))}
            <Text style={styles.reimbursementsText}>Reimbursements</Text>
            {reimbursements.map((reimbursement, index) => (
              <View key={index} style={styles.reimbursementContainer}>
                <Text style={styles.largerText}>
                  {reimbursement.from} owes {reimbursement.to}
                </Text>
                <Text style={styles.largerText}>
                  {reimbursement.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  groupTitleText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  tabsRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  expensesTab: {
    padding: 8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    width: "50%",
    alignItems: "center",
  },
  balancesTab: {
    padding: 8,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    width: "50%",
    alignItems: "center",
  },
  activeTab: {
    borderWidth: 1,
    borderColor: "#0275d8",
    backgroundColor: "#0275d8",
  },
  inactiveTab: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#ddd",
  },
  activeText: {
    color: "white",
  },
  noExpensesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  expenseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
    padding: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  largerText: {
    fontSize: 16,
  },
  paidByText: {
    color: "#666",
  },
  balancesText: {
    fontSize: 16,
    marginBottom: 5,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
    padding: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  zeroBalanceText: {
    fontSize: 16,
    color: "#666",
  },
  positiveBalanceText: {
    fontSize: 16,
    color: "#28a745",
  },
  negativeBalanceText: {
    fontSize: 16,
    color: "#dc3545",
  },
  reimbursementsText: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  reimbursementContainer: {
    alignItems: "center",
    backgroundColor: "#ddd",
    padding: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
});

export default Group;
