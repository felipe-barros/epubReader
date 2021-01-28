import moment from 'moment';
import 'moment/locale/pt-br';
import React from 'react';
import { FlatList, Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import style from './style';

function ModalNotes({ notes, toggleModal, isModalVisible, isDarkMode }) {


    function renderNote({ item }) {
        console.log(item)
        moment.locale('pt-br');
        const relativeDate = moment(item.date).fromNow();
        return (
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: 'gray', paddingBottom: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, textAlign: 'right', color: 'gray' }}>Página {item.page}</Text>
                    <Text style={{ fontSize: 14, textAlign: 'right', color: 'gray' }}>{relativeDate}</Text>
                </View>
                <View style={{ paddingVertical: 10, paddingLeft: 10, borderLeftWidth: 4, borderLeftColor: item.color }}>
                    <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 16, color: 'gray' }}>{item.text}</Text>
                </View>
                <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontSize: 18 }} numberOfLines={3} ellipsizeMode='tail'>{item.data}</Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={[style.container]}>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}>
                <View style={style.modalContainer}>
                    <View style={[style.resultsContainer, { backgroundColor: isDarkMode ? '#666' : '#FFF' }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => toggleModal(false)} style={{ padding: 10, alignSelf: 'flex-end' }}>
                                <Text style={{ textAlign: 'center', fontSize: 18, color: 'dodgerblue' }}>Voltar</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={notes}
                            renderItem={renderNote}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}

export default ModalNotes;