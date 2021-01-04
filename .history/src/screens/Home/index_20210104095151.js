import React, { useRef } from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import html from '../../templates/index.html';
import style from './style';

function Home() {
    const webview = useRef();

    let injectedJS = `window.BOOK_PATH = "../books/book.epub";`;

    function goPrev() {
        webview.current?.injectJavaScript(`window.rendition.prev(); true`);
    }

    function goNext() {
        webview.current?.injectJavaScript(`window.rendition.next(); true`);
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
                <Button title='Anterior' color='#FFF' onPress={goPrev} />
                <Button title='-' color='#FFF' onPress={goPrev} />
                <Button title='+' color='#FFF' onPress={goPrev} />
                <Button title='Próxima' color='#FFF' onPress={goNext} />
            </View>
        </SafeAreaView>
    )
}

export default Home;