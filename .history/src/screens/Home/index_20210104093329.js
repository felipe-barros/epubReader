import React from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import html from '../../templates/test.html';
import style from './style';

function Home() {

    let injectedJS = `window.BOOK_PATH = "../books/book.epub";`;

    return (
        <SafeAreaView style={style.container}>
            <View style={style.content}>
                <WebView
                    source={html}
                    originWhitelist={["*"]}
                    injectedJavaScriptBeforeContentLoaded={injectedJS}
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