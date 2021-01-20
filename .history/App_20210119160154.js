/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import 'react-native-gesture-handler';
import MainNavigator from './src/navigation/MainNavigator';
// adb -s 260719107000314 reverse tcp:8081 tcp:8081
function App() {
  return (
    <MainNavigator />
  );
};

export default App;
