import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
<<<<<<< HEAD

const books = [
    {
        title: "Biologia - Colégio CEV",
        path: "file:///android_asset/books/cev.epub"
    },
    {
        title: "Knight without Armour",
        path: "file:///android_asset/books/example.epub"
    }
]

function Home({ navigation }) {

    function renderBook({ item }) {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Reader1', { title: item.title, path: item.path })} style={{ borderBottomWidth: 1, borderBottomColor: 'lightgray', paddingBottom: 20, marginBottom: 10, marginTop: 20 }}>
                <Text style={{ fontSize: 18 }}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ backgroundColor: '#FFF', padding: 20, flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: 'gray' }}>Selecione um Livro</Text>
            <FlatList
                data={books}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderBook}
            />
=======
import { Button, Text, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

function Home({ navigation }) {

    function goReader(name, path) {
        navigation.navigate('Reader', { name, path })
    }

    const pickFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            // const split = res.uri.split('/')
            // const name = split.pop();
            // const inbox = split.pop();
            // const realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;

            goReader(res.name, res.uri);
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
>>>>>>> fdc8b80c3ac2226a02edfe9846ef4f4f96fd07d1
        </View>
    )
}

export default Home;