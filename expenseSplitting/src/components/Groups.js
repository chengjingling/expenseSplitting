import React, { useState, useEffect } from "react";
import { SafeAreaView, View, TouchableOpacity, Text } from "react-native";
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
    <SafeAreaView>
      <View>
        {groupTitles.map((groupTitle, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate("Group", { groupTitle })}
          >
            <Text>{groupTitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Groups;
