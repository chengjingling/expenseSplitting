import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

const Group = ({ route }) => {
  const { groupTitle } = route.params;
  const [tab, setTab] = useState("Expenses");
  const [expenses, setExpenses] = useState({});
  const [users, setUsers] = useState({});

  useEffect(() => {
    const expensesCollection = collection(db, "groups", groupTitle, "expenses");
    onSnapshot(expensesCollection, (snapshot) => {
      const expensesObj = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});
      setExpenses(expensesObj);
    });
    const usersCollection = collection(db, "groups", groupTitle, "users");
    onSnapshot(usersCollection, (snapshot) => {
      const usersObj = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});
      setUsers(usersObj);
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
          Object.entries(expenses).map(([id, expense]) => (
            <View key={id}>
              <Text>{expense.title}</Text>
              <Text>
                Paid by {users[expense.paidBy]?.firstName}{" "}
                {users[expense.paidBy]?.lastName}
              </Text>
              <Text>${expense.amount}</Text>
            </View>
          ))}
        {tab === "Balances" && <Text>Balances</Text>}
      </View>
    </SafeAreaView>
  );
};

export default Group;
