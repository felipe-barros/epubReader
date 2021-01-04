import React, { useRef, useState } from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import html from '../../templates/index.html';
import themeToStyles from '../../utils/themeToStyles';
import style from './style';

const estilo = {
    bg: '#FFF',
    fg: '#FFF',
    size: '150%',
}
function Home() {
    const [fontSize, setFontSize] = useState("100%");
    const [currentLocation, setCurrentLocation] = useState(null);
    const webview = useRef();

    let injectedJS = `window.BOOK_PATH = "../books/book.epub"; window.THEME = ${JSON.stringify(themeToStyles(estilo))};`;

    function goPrev() {
        webview.current?.injectJavaScript(`window.rendition.prev(); true`);
    }

    function goNext() {
        webview.current?.injectJavaScript(`window.rendition.next(); window.ReactNativeWebView.postMessage(window.rendition.currentLocation()); true`);
    }

    function refresh() {
        webview.current?.injectJavaScript(`window.BOOK_LOCATION = "${currentLocation}"`);
        webview.current?.reload();
    }

    function decreaseFontSize() {
        ß
    }

    function increaseFontSize() {

    }

    return (
        <SafeAreaView style={style.container}>
            <View style={style.content}>
                <WebView
                    ref={webview}
                    source={html}
                    originWhitelist={["*"]}
                    injectedJavaScriptBeforeContentLoaded={injectedJS}
                    scrollEnabled={false}
                    onMessage={(event) => {
                        setCurrentLocation(event.nativeEvent.data);
                    }}
                    onLoadStart={(syntheticEvent) => {
                        // update component to be aware of loading status
                        alert("Loading")
                    }}
                />
            </View>
            <View style={style.footer}>
                <Button title='Anterior' color='#FFF' onPress={goPrev} />
                <Button title='-' color='#FFF' onPress={decreaseFontSize} />
                <Button title='+' color='#FFF' onPress={increaseFontSize} />
                <Button title='Próxima' color='#FFF' onPress={goNext} />
            </View>
        </SafeAreaView>
    )
}

export default Home;