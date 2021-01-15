import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Home from '../screens/Home';
import Reader from '../screens/Reader';

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerBackTitleVisible: false
            }}>
                <Stack.Screen name="Home" component={Home} options={{ title: "Selecione um livro" }} />
                <Stack.Screen name="Reader" component={Reader} options={({ route }) => ({ title: route.params.title })} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;