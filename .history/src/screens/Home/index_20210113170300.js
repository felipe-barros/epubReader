import React from 'react';
import { Text, View } from 'react-native';

function Home() {

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', padding: 20 }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Selecione um livro</Text>
        </View>
    )
}

export default Home;