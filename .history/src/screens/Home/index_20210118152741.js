import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';


function Home() {

    return (
        <View style={{ backgroundColor: '#FFF', padding: 20, flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>Selecione um Livro</Text>
            <TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: 'lightgray', paddingBottom: 20, marginBottom: 10, marginTop: 20 }}>
                <Text style={{ fontSize: 18 }}>Biologia - CEV</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>Knight without Armour</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Home;