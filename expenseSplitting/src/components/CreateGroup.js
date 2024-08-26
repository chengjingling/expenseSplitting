import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { doc, collection, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";

const CreateGroup = () => {
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState([""]);
  const [participantsValid, setParticipantsValid] = useState([""]);
  const navigation = useNavigation();

  const handleParticipantChange = (text, index) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = text;
    setParticipants(updatedParticipants);
  };

  useEffect(() => {
    setParticipantsValid([""]);
  }, [participants]);

  const createGroup = () => {
    if (!title) {
      Alert.alert("Error", "Title cannot be blank.");
    } else if (participants.length === 0) {
      Alert.alert("Error", "Please enter at least one participant.");
    } else {
      let statuses = [];
      let checked = [];
      for (const participant of participants) {
        if (participant) {
          if (checked.includes(participant)) {
            statuses.push("duplicate");
          } else {
            statuses.push("valid");
          }
        } else {
          statuses.push("blank");
        }
        checked.push(participant);
      }
      setParticipantsValid(statuses);
    }
  };

  useEffect(() => {
    if (participantsValid.every((status) => status === "valid")) {
      const newDoc = doc(collection(db, "groups"), title);
      setDoc(newDoc, {
        participants: participants,
      });
      navigation.navigate("Group", { groupTitle: title });
    }
  }, [participantsValid]);

  return (
    <SafeAreaView>
      <View>
        <Text>Title</Text>
        <TextInput value={title} onChangeText={setTitle} />
        <Text>Participants</Text>
        {participants.map((participant, index) => (
          <View key={index}>
            <View>
              <TextInput
                value={participant}
                onChangeText={(text) => handleParticipantChange(text, index)}
              />
              <TouchableOpacity
                onPress={() =>
                  setParticipants(participants.filter((_, i) => i !== index))
                }
              >
                <Text>Remove</Text>
              </TouchableOpacity>
            </View>
            {participantsValid[index] === "blank" && (
              <Text>Participant cannot be blank.</Text>
            )}
            {participantsValid[index] === "duplicate" && (
              <Text>This participant has already been entered.</Text>
            )}
          </View>
        ))}
        <TouchableOpacity
          onPress={() => setParticipants([...participants, ""])}
        >
          <Text>Add participant</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => createGroup()}>
          <Text>Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateGroup;
