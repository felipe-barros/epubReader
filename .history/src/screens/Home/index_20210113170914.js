import React from 'react';
import { FlatList, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const books = [
    {
        title: 'Knight Without Armour',
        path: '../../books/book2.epub'
    },
    {
        title: 'Geografia - CEV',
        path: '../../books/book.epub'
    }
]

function Home() {

    function renderBook({ item }) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='book' size={30} color='gray' />
                <Text style={{ fontSize: 18, marginLeft: 20 }}>{item.title}</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Selecione um livro</Text>
            <FlatList
                data={books}
                renderItem={renderBook} />
        </View>
    )
}

export default Home;