import moment from 'moment';
import 'moment/locale/pt-br';
import React from 'react';
import { FlatList, Modal, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import style from './style';

function NotesPages({ notes, toggleModal, isModalVisible, isDarkMode, goToNote, pages }) {

    return (
        <SafeAreaView style={[style.container]}>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}>
                <View style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={() => toggleModal(false)} >
                        <View style={{ flex: 0.5, backgroundColor: 'rgba(0,0,0,0.5)' }}></View>
                    </TouchableWithoutFeedback>
                    <View style={{ flex: 1.5, backgroundColor: isDarkMode ? '#666' : '#FFF' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 18, padding: 20, textAlign: 'center', borderBottomWidth: isSelected ? 4 : 0 }}>Anotações</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 18, padding: 20, textAlign: 'center' }}>Páginas Salvas</Text>
                            </TouchableOpacity>
                        </View>
                        <ModalNotes notes={notes} toggleModal={toggleModal} isModalVisible={isModalVisible} isDarkMode={isDarkMode} goToNote={goToNote} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
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

        <View style={{ flex: 1, padding: 10 }}>
            <FlatList
                data={notes}
                renderItem={renderNote}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 10 }}></View>}
                ListHeaderComponent={() => <View style={{ height: 10 }}></View>}
                ListFooterComponent={() => <View style={{ height: 10 }}></View>}
                ListEmptyComponent={() => <Text style={{ color: 'gray', fontSize: 16, textAlign: 'center', marginTop: 20 }}>Nenhuma anotação salva.</Text>}
            />
        </View>
    )
}


export default NotesPages;