import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";

const Groups = () => {
  const [groupTitles, setGroupTitles] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const groupsCollection = collection(db, "groups");
    onSnapshot(groupsCollection, (snapshot) => {
      const groupTitlesList = snapshot.docs.map((doc) => doc.id);
      setGroupTitles(groupTitlesList);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.splitSmartText}>SplitSmart</Text>
        {groupTitles.map((groupTitle, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate("Group", { groupTitle })}
            style={styles.groupButton}
          >
            <Text>{groupTitle}</Text>
            <Text>{">"}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  splitSmartText: {
    fontSize: 24,
    marginBottom: 10,
  },
  groupButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default Groups;
