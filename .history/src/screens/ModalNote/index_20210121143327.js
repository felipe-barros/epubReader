import React from 'react';
import { Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import style from './style';

function ModalNote({ toggleModal, currentNote, isModalVisible, isDarkMode }) {

    return (
        <SafeAreaView style={[style.container]}>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}>
                <View style={style.modalContainer}>
                    <View style={[style.resultsContainer, { backgroundColor: isDarkMode ? '#666' : '#FFF' }]}>
                        <TouchableOpacity onPress={() => toggleModal(false)} style={{ padding: 10, alignSelf: 'flex-end' }}>
                            <Text style={{ textAlign: 'center', fontSize: 18, color: 'dodgerblue', marginBottom: 10 }}>Salvar</Text>
                        </TouchableOpacity>
                        {currentNote && <Text style={{ fontSize: 18, padding: 20, backgroundColor: '#ebebeb', borderLeftWidth: 3, borderLeftColor: 'dodgerblue', marginBottom: 10, color: 'gray' }} numberOfLines={3} ellipsizeMode='tail'>{currentNote.text}</Text>}
                        <TextInput
                            placeholder="Adicionar nota à marcação"
                            autoFocus={true}
                            multiline={true}
                            textAlignVertical='top'
                            numberOfLines={3}
                            style={{ fontSize: 18, padding: 5 }}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default ModalNote;