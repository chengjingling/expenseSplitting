import { TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Groups from "./src/components/Groups";
import CreateGroup from "./src/components/CreateGroup";
import Group from "./src/components/Group";
import CreateExpense from "./src/components/CreateExpense";
import Expense from "./src/components/Expense";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Groups"
          component={Groups}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("New Group")}
              >
                <Text>New Group</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="New Group" component={CreateGroup} />
        <Stack.Screen
          name="Group"
          component={Group}
          options={({ route, navigation }) => {
            const { groupTitle } = route.params;
            return {
              headerTitle: "",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Add Expense", { groupTitle })
                  }
                >
                  <Text>Add Expense</Text>
                </TouchableOpacity>
              ),
            };
          }}
        />
        <Stack.Screen name="Add Expense" component={CreateExpense} />
        <Stack.Screen name="Expense" component={Expense} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
