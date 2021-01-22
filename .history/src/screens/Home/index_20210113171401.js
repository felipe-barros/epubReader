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
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', paddingBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='book' size={30} color='gray' />
                    <Text style={{ fontSize: 18, marginLeft: 20 }}>{item.title}</Text>
                </View>
                <Icon name='chevron-forward-outline' size={25} color='lightgray' />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fafafa', padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Selecione um livro</Text>
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