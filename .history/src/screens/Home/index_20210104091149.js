import React from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import html from '../../templates/index.html';
import style from './style';

function Home() {
    return (
        <SafeAreaView style={style.container}>
            <View style={style.content}>
                <WebView
                    source={html}
                // originWhitelist={["*"]}
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