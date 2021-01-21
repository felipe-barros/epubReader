import React, { useState } from 'react';
import { Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import style from './style';

function ModalNote({ toggleModal, currentNote, isModalVisible, isDarkMode, saveNote }) {
    const [note, setNote] = useState(currentNote ? currentNote.data : "");
    console.log(currentNote)
    return (
        <SafeAreaView style={[style.container]}>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}>
                <View style={style.modalContainer}>
                    <View style={[style.resultsContainer, { backgroundColor: isDarkMode ? '#666' : '#FFF' }]}>
                        <TouchableOpacity onPress={() => { saveNote(currentNote.epubcfi, note); toggleModal(false) }} style={{ padding: 10, alignSelf: 'flex-end' }}>
                            <Text style={{ textAlign: 'center', fontSize: 18, color: 'dodgerblue', marginBottom: 10 }}>Salvar</Text>
                        </TouchableOpacity>
                        {currentNote && <Text style={{ fontSize: 18, padding: 20, backgroundColor: '#ebebeb', borderLeftWidth: 3, borderLeftColor: 'dodgerblue', marginBottom: 10, color: 'gray' }} numberOfLines={3} ellipsizeMode='tail'>{currentNote.text}</Text>}
                        <TextInput
                            placeholder="Adicionar nota à marcação"
                            autoFocus={true}
                            multiline={true}
                            textAlignVertical='top'
                            numberOfLines={3}
                            text={note}
                            onChangeText={setNote}
                            style={{ fontSize: 18 }}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default ModalNote;