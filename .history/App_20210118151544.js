/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import Home from './src/screens/Home';
// adb -s 281019004000202 reverse tcp:8081 tcp:8081
function App() {
  return (
    <NavigationContainer>
      <Home />
    </NavigationContainer>
  );
};

export default App;
