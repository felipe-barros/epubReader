/**
import { Button, FlatList, Modal, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import htmlPathIos from '../../templates/index.html';
import themeToStyles from '../../utils/themeToStyles';
import ModalNote from '../ModalNote';
import style from './style';
import 'react-native-gesture-handler';
import MainNavigator from './src/navigation/MainNavigator';
// adb -s R9XN504KZSD reverse tcp:8081 tcp:8081
function App() {
  return (
    <MainNavigator />
  );
};

export default App;
