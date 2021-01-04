import React from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import html from '../../templates/test.html';
import style from './style';

function Home() {

    let injectedJS = `document.body.style.backgroundColor = 'red';
    setTimeout(function() { window.alert('hi') }, 2000);
    true; // note: this is required, or you'll sometimes get silent failures`;

    return (
        <SafeAreaView style={style.container}>
            <View style={style.content}>
                <WebView
                    source={html}
                    originWhitelist={["*"]}
                    onMessage={(event) => { }}
                    injectedJS={injectedJS}
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