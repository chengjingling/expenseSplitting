import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
    <SafeAreaView>
      <View>
        <Text>Title</Text>
        <TextInput value={expenseTitle} onChangeText={setExpenseTitle} />
        <Text>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Text>Paid by</Text>
        <Picker selectedValue={paidBy} onValueChange={setPaidBy}>
          {allParticipants.map((participant, index) => (
            <Picker.Item key={index} label={participant} value={participant} />
          ))}
        </Picker>
        <Text>Participants</Text>
        {allParticipants.map((participant, index) => (
          <View key={index}>
            <CheckBox
              value={checked[index]}
              onValueChange={(value) =>
                setChecked(
                  checked.map((isChecked, i) =>
                    i === index ? value : isChecked
                  )
                )
              }
            />
            <Text>{participant}</Text>
          </View>
        ))}
        <TouchableOpacity onPress={() => createExpense()}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateExpense;
