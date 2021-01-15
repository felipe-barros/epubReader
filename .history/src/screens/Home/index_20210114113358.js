import React from 'react';
import { Button, Text, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';


function Home({ navigation }) {

    function goReader(item) {
        navigation.navigate('Reader', { title: item.title, pathIos: item.pathIos, pathAndroid: item.pathAndroid })
    }

    const pickFile = async () => {
        // Pick a single file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log(
                "Uri:", res.uri
            );
            console.log(
                "Type:", res.type
            );
            console.log(
                "Name:", res.name
            );
            console.log(
                "Size:", res.size
            );
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fafafa', padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 30 }}>Selecione um livro</Text>
            <Button title="Buscar livro" onPress={pickFile} />
        </View>
    )
}

export default Home;