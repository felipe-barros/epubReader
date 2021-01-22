import React from 'react';
import { Text, View } from 'react-native';

function Reader({ route }) {
    const { title, path } = route.params;

    return (
        <View>
            <Text>Reader</Text>
        </View>
    )
}

export default Reader;