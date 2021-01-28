import moment from 'moment';
import 'moment/locale/pt-br';
import React from 'react';
import { FlatList, Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import style from './style';

function ModalNotes({ notes, toggleModal, isModalVisible, isDarkMode, goToNote }) {

    function renderNote({ item }) {
        console.log(item)
        moment.locale('pt-br');
        const relativeDate = moment(item.date).fromNow();
        return (
            <TouchableOpacity onPress={() => goToNote(item.cfi)} style={{ borderBottomWidth: 0.5, borderBottomColor: 'lightgray', paddingBottom: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, textAlign: 'right', color: 'gray' }}>Página {item.page}</Text>
                    <Text style={{ fontSize: 14, textAlign: 'right', color: 'gray' }}>{relativeDate}</Text>
                </View>
                <View style={{ paddingVertical: 10, paddingLeft: 10, borderLeftWidth: 4, borderLeftColor: item.color }}>
                    <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 16, color: 'gray' }}>{item.text}</Text>
                </View>
                {item.data != "" && <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontSize: 18 }} numberOfLines={3} ellipsizeMode='tail'>{item.data}</Text>
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
                <View style={style.modalContainer}>
                    <View style={[style.resultsContainer, { backgroundColor: isDarkMode ? '#666' : '#FFF' }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View></View>
                            <Text style={{ fontSize: 18 }}>Anotações salvas</Text>
                            <TouchableOpacity onPress={() => toggleModal(false)} style={{ padding: 10, alignSelf: 'flex-end' }}>
                                <Text style={{ textAlign: 'center', fontSize: 18, color: 'dodgerblue' }}>Voltar</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={notes}
                            renderItem={renderNote}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }}></View>}
                            ListHeaderComponent={() => <View style={{ height: 10 }}></View>}
                            ListFooterComponent={() => <View style={{ height: 10 }}></View>}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}

export default ModalNotes;