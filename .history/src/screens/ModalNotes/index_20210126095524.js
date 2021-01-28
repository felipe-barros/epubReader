import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import style from './style';

function ModalNotes({ notes, toggleModal, isModalVisible, isDarkMode }) {
    const [note, setNote] = useState(currentNote ? currentNote.data : "");
    const [color, setColor] = useState('dodgerblue');

    useEffect(() => {
        setNote(currentNote ? currentNote.data : "")
    }, [isModalVisible])

    console.log(notes);
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
                                <Text style={{ textAlign: 'center', fontSize: 18, color: 'dodgerblue', marginBottom: 10 }}>Voltar</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}

export default ModalNotes;