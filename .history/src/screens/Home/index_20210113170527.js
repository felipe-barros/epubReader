import React from 'react';
import { Text, View } from 'react-native';

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

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', padding: 20 }}>
            <Text style={{ fontSize: 16 }}>Selecione um livro</Text>

        </View>
    )
}

export default Home;