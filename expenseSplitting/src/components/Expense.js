import { SafeAreaView, View, Text } from "react-native";
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
    <SafeAreaView>
      <View>
        <Text>{expense.title}</Text>
        <Text>{formattedDateTimeAdded()}</Text>
        <Text>{expense.paidBy}</Text>
        <Text>{Number(expense.amount).toFixed(2)}</Text>
        {expense.participants.map((participant, index) => (
          <View key={index}>
            <Text>{participant}</Text>
            <Text>
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

export default Expense;
