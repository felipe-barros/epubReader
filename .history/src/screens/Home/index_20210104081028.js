import React from 'react';
import { View, Button, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import html from '../../templates/swipe.html';
import style from './style';

function Home() {
    return (
        <SafeAreaView style={style.container}>
            <View style={style.content}>
                <WebView
                    source={html}
                    originWhitelist={["*", "css"]}
                />
            </View>
            <View style={style.footer}>
                <Button title='Anterior' color='#FFF' />
                <Button title='Próxima' color='#FFF' />
            </View>
        </SafeAreaView>
    )
}

export default Home;