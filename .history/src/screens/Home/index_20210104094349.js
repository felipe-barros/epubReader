import React, { useRef } from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import html from '../../templates/index.html';
import style from './style';

function Home() {
    const webview = useRef();

    let injectedJS = `window.BOOK_PATH = "../books/book.epub";`;

    function goPrev() {
        webview.current?.injectJavaScript(`window.rendition.prev()`);
    }

    function goNext() {
        webview.current?.injectJavaScript(`window.rendition.next()`);
    }

    return (
        <SafeAreaView style={style.container}>
            <View style={style.content}>
                <WebView
                    ref={webview}
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