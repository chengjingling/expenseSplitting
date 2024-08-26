import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";

const Group = ({ route }) => {
  const { groupTitle } = route.params;
  const [tab, setTab] = useState("Expenses");
  const [expenses, setExpenses] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
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

  return (
    <SafeAreaView>
      <View>
        <Text>{groupTitle}</Text>
        <TouchableOpacity onPress={() => setTab("Expenses")}>
          <Text>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab("Balances")}>
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
        {tab === "Balances" && <Text>Balances</Text>}
      </View>
    </SafeAreaView>
  );
};

export default Group;
