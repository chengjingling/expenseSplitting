import { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./src/config/firebase";

export default function App() {
  const [expenses, setExpenses] = useState({});
  const [users, setUsers] = useState({});

  useEffect(() => {
    const expensesCollection = collection(db, "groups", "JB", "expenses");
    onSnapshot(expensesCollection, (snapshot) => {
      const expensesObj = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});
      setExpenses(expensesObj);
    });
    const usersCollection = collection(db, "groups", "JB", "users");
    onSnapshot(usersCollection, (snapshot) => {
      const usersObj = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});
      setUsers(usersObj);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {Object.entries(expenses).map(([id, expense]) => (
          <View key={id}>
            <Text>{expense.title}</Text>
            <Text>{expense.dateTime}</Text>
            <Text>{expense.amount}</Text>
            <Text>
              {users[expense.paidBy]?.firstName}{" "}
              {users[expense.paidBy]?.lastName}
            </Text>
            {expense.participants.map((participantId) => (
              <View key={participantId}>
                <Text>
                  {users[participantId]?.firstName}{" "}
                  {users[participantId]?.lastName}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
