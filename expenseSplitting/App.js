import { TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Groups from "./src/components/Groups";
import CreateGroup from "./src/components/CreateGroup";
import Group from "./src/components/Group";

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
                <Text>+</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="New Group" component={CreateGroup} />
        <Stack.Screen
          name="Group"
          component={Group}
          options={{ headerTitle: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
