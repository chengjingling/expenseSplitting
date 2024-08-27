import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { getDoc, doc, collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Picker } from "@react-native-picker/picker";
import CheckBox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";

const CreateExpense = ({ route }) => {
  const { groupTitle } = route.params;
  const [expenseTitle, setExpenseTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [allParticipants, setAllParticipants] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [checked, setChecked] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const groupDoc = await getDoc(doc(collection(db, "groups"), groupTitle));
      const participants = groupDoc.data().participants;
      setAllParticipants(participants);
    })();
  }, []);

  useEffect(() => {
    setPaidBy(allParticipants[0]);
    setChecked(new Array(allParticipants.length).fill(true));
  }, [allParticipants]);

  const createExpense = () => {
    if (!expenseTitle) {
      Alert.alert("Error", "Title cannot be blank.");
    } else if (!amount) {
      Alert.alert("Error", "Amount cannot be blank.");
    } else if (isNaN(Number(amount))) {
      Alert.alert("Error", "Amount must be a number.");
    } else if (Number(amount) <= 0) {
      Alert.alert("Error", "Amount must be more than 0.");
    } else if (checked.every((isChecked) => !isChecked)) {
      Alert.alert("Error", "There must be at least 1 participant.");
    } else {
      const expensesCollection = collection(
        db,
        "groups",
        groupTitle,
        "expenses"
      );
      addDoc(expensesCollection, {
        title: expenseTitle,
        amount: amount,
        paidBy: paidBy,
        participants: allParticipants.filter((_, index) => checked[index]),
        dateTimeAdded: new Date(),
      });
      Alert.alert("Success", "Expense added!");
      navigation.navigate("Group", { groupTitle });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={expenseTitle}
          onChangeText={setExpenseTitle}
          style={styles.input}
        />
        <Text style={styles.label}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <Text style={styles.label}>Paid by</Text>
        <Picker
          selectedValue={paidBy}
          onValueChange={setPaidBy}
          style={styles.picker}
        >
          {allParticipants.map((participant, index) => (
            <Picker.Item key={index} label={participant} value={participant} />
          ))}
        </Picker>
        <Text style={styles.label}>Participants</Text>
        {allParticipants.map((participant, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              setChecked(
                checked.map((isChecked, i) =>
                  i === index ? !isChecked : isChecked
                )
              )
            }
            style={styles.checkboxButton}
          >
            <CheckBox
              value={checked[index]}
              onValueChange={(value) =>
                setChecked(
                  checked.map((isChecked, i) =>
                    i === index ? value : isChecked
                  )
                )
              }
              style={styles.checkbox}
            />
            <Text>{participant}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => createExpense()}
          style={styles.addButton}
        >
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 4,
    marginBottom: 20,
  },
  picker: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginTop: -22,
    marginBottom: -2,
  },
  checkboxButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    padding: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  checkbox: {
    marginRight: 10,
  },
  addButton: {
    borderWidth: 1,
    borderColor: "#0275d8",
    backgroundColor: "#0275d8",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 15,
  },
  addText: {
    color: "white",
  },
});

export default CreateExpense;
