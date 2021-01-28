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
// adb -s R9XN504KZSD reverse tcp:8081 tcp:8081
// adb -s 9400683579A229A reverse tcp:8081 tcp:8081
function App() {
  return (
    <MainNavigator />
  );
};

export default App;
