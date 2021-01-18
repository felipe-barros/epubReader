import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Home from '../screens/Home';
import Reader1 from '../screens/Reader1';
import Reader2 from '../screens/Reader2';

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Home" component={Reader1} />
                <Stack.Screen name="Home" component={Reader2} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;