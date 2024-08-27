import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";

const Expense = ({ route }) => {
  const { expense } = route.params;

  const formattedDateTimeAdded = () => {
    const dateObj = new Date(
      expense.dateTimeAdded.seconds * 1000 +
        expense.dateTimeAdded.nanoseconds / 1000000
    );
    return format(dateObj, "eeee, d MMM yyyy h:mm a");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>{expense.title}</Text>
        <Text style={styles.dateText}>{formattedDateTimeAdded()}</Text>
        <Text style={styles.paidByText}>Paid By</Text>
        <View style={styles.row}>
          <Text>{expense.paidBy}</Text>
          <Text style={styles.totalAmountText}>
            ${Number(expense.amount).toFixed(2)}
          </Text>
        </View>
        <Text style={styles.participantsText}>Participants</Text>
        {expense.participants.map((participant, index) => (
          <View key={index} style={styles.row}>
            <Text>{participant}</Text>
            <Text>
              $
              {(Number(expense.amount) / expense.participants.length).toFixed(
                2
              )}
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titleText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 5,
  },
  dateText: {
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  paidByText: {
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
    padding: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  totalAmountText: {
    color: "#ff5500",
  },
  participantsText: {
    marginTop: 15,
    marginBottom: 5,
  },
});

export default Expense;
