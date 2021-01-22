import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const books = [
    {
        title: 'Knight Without Armour',
        pathIos: '../books/book2.epub',
        pathAndroid: '../../../../../../src/books/book2.epub'
    },
    {
        title: 'Geografia - CEV',
        pathIos: '../books/book.epub',
        pathAndroid: '../../../../../../src/books/book.epub'
    }
]

function Home({ navigation }) {

    function goReader(item) {
        navigation.navigate('Reader', { title: item.title, pathIos: item.pathIos, pathAndroid: item.pathAndroid })
    }

    function renderBook({ item }) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => goReader(item)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'lightgray', paddingBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='book' size={30} color='gray' />
                    <Text style={{ fontSize: 18, marginLeft: 20 }}>{item.title}</Text>
                </View>
                <Icon name='chevron-forward-outline' size={25} color='lightgray' />
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fafafa', padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 30 }}>Selecione um livro</Text>
            <FlatList
                data={books}
                renderItem={renderBook}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 20 }}></View>}
            />
        </View>
    )
}

export default Home;