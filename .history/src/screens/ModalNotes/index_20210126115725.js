import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import moment from 'moment';
import 'moment/locale/pt-br';
import React from 'react';
import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import style from './style';


const Tab = createMaterialTopTabNavigator();

function Teste() {
    return <View></View>
}

function ModalNotes({ notes, toggleModal, isModalVisible, isDarkMode, goToNote }) {

    function renderNote({ item }) {
        moment.locale('pt-br');
        const relativeDate = moment(item.date).fromNow();
        return (
            <TouchableOpacity onPress={() => { goToNote(item.cfi); toggleModal(false) }} style={{ borderBottomWidth: 0.5, borderBottomColor: 'lightgray', paddingBottom: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, textAlign: 'right', color: isDarkMode ? '#FFF' : 'gray' }}>Página {item.page}</Text>
                    <Text style={{ fontSize: 14, textAlign: 'right', color: isDarkMode ? '#FFF' : 'gray' }}>{relativeDate}</Text>
                </View>
                <View style={{ paddingVertical: 10, paddingLeft: 10, borderLeftWidth: 4, borderLeftColor: item.color }}>
                    <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 16, color: isDarkMode ? '#FFF' : 'gray' }}>{item.text}</Text>
                </View>
                {item.data != "" && <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontSize: 18, color: isDarkMode ? '#FFF' : '#000' }} numberOfLines={3} ellipsizeMode='tail'>{item.data}</Text>
                </View>}
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={[style.container]}>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}>
                <View style={{ flex: 1 }}>
                    <Tab.Navigator>
                        <Tab.Screen name="Notes" component={Teste} />
                        <Tab.Screen name="Notes2" component={Teste} />
                    </Tab.Navigator>
                </View>
            </Modal>
        </SafeAreaView >
    )
}


export default ModalNotes;