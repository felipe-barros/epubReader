import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';


function Home({ navigation }) {

    return (
        <View style={{ backgroundColor: '#FFF', padding: 20, flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: 'gray' }}>Selecione um Livro</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Reader1')} style={{ borderBottomWidth: 1, borderBottomColor: 'lightgray', paddingBottom: 20, marginBottom: 10, marginTop: 20 }}>
                <Text style={{ fontSize: 18 }}>Biologia - CEV</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Reader2')} style={{ borderBottomWidth: 1, borderBottomColor: 'lightgray', paddingBottom: 20, marginBottom: 10, marginTop: 20 }}>
                <Text style={{ fontSize: 18 }}>Knight withou Armour - CEV</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Home;