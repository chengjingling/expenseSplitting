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
      navigation.replace("Group", { groupTitle: title });
    }
  }, [participantsValid]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.titleInput}
        />
        <Text style={styles.label}>Participants</Text>
        {participants.map((participant, index) => (
          <View key={index} style={styles.participantRowContainer}>
            <View style={styles.participantRow}>
              <TextInput
                value={participant}
                onChangeText={(text) => handleParticipantChange(text, index)}
                style={styles.participantInput}
              />
              <TouchableOpacity
                onPress={() =>
                  setParticipants(participants.filter((_, i) => i !== index))
                }
                style={styles.removeButton}
              >
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
            {participantsValid[index] === "blank" && (
              <Text style={styles.invalidText}>
                Participant cannot be blank.
              </Text>
            )}
            {participantsValid[index] === "duplicate" && (
              <Text style={styles.invalidText}>
                This participant has already been entered.
              </Text>
            )}
          </View>
        ))}
        <TouchableOpacity
          onPress={() => setParticipants([...participants, ""])}
          style={styles.addParticipantButton}
        >
          <Text style={styles.addParticipantText}>Add participant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => createGroup()}
          style={styles.createButton}
        >
          <Text style={styles.buttonText}>Create</Text>
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
  titleInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 4,
    marginBottom: 20,
  },
  participantRowContainer: {
    marginBottom: 5,
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  participantInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 4,
    width: "78%",
  },
  removeButton: {
    borderWidth: 1,
    borderColor: "#dc3545",
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
  },
  invalidText: {
    color: "#dc3545",
    marginBottom: 5,
  },
  addParticipantButton: {
    marginBottom: 20,
  },
  addParticipantText: {
    color: "#0275d8",
  },
  createButton: {
    borderWidth: 1,
    borderColor: "#0275d8",
    backgroundColor: "#0275d8",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
});

export default CreateGroup;
