import React, { useRef, useState } from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import html from '../../templates/index.html';
import themeToStyles from '../../utils/themeToStyles';
import style from './style';

function Home() {
    const webview = useRef();
    const [theme, setTheme] = useState({
        bg: '#FFF',
        fg: '#000',
        size: '150%',
    })
    const [cl, setCl] = useState(null);

    let injectedJS = `window.BOOK_PATH = "../books/book.epub"; window.THEME = ${JSON.stringify(themeToStyles(theme))}; true`;

    if (cl) {
        injectedJS = `${injectedJS}
        window.BOOK_LOCATION = '${cl}';
        window.ReactNativeWebView.postMessage("a"); true
		`;
    }

    function goPrev() {
        webview.current?.injectJavaScript(`window.rendition.prev(); true`);
    }

    function goNext() {
        webview.current?.injectJavaScript(`window.rendition.next(); true`);
    }

    function refresh() {
        webview.current?.injectJavaScript(`window.BOOK_LOCATION = "${cl}"`);
        webview.current?.reload();
    }

    function changeThemeStyle(newTheme) {
        webview.current?.injectJavaScript(`
		window.rendition.themes.register({ theme: "${JSON.stringify(themeToStyles(newTheme))}" });
		window.rendition.themes.select('theme');`);
        refresh();
    }

    function decreaseFontSize() {
        setTheme({
            bg: '#FFF',
            fg: '#000',
            size: '100%',
        });
        refresh();
    }

    function increaseFontSize() {
        setTheme({
            bg: '#FFF',
            fg: '#000',
            size: '200%',
        });
        refresh();
    }

    function getCurrentLocation() {
        webview.current?.injectJavaScript(`window.ReactNativeWebView.postMessage(window.rendition.currentLocation()); true`);
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
                    onLoadStart={(syntheticEvent) => {
                        // update component to be aware of loading status
                        console.log("Start Loading")
                    }}
                    onLoadEnd={(syntheticEvent) => {
                        console.log("End Loading")
                    }}
                    onMessage={(event) => {
                        setCl(event.nativeEvent.data);
                        console.log("ok");
                    }}
                />
            </View>
            <View style={style.footer}>
                <Button title='Anterior' color='#FFF' onPress={goPrev} />
                <Button title='-' color='#FFF' onPress={decreaseFontSize} />
                <Button title='o' color='#FFF' onPress={getCurrentLocation} />
                <Button title='+' color='#FFF' onPress={increaseFontSize} />
                <Button title='Próxima' color='#FFF' onPress={goNext} />
            </View>
        </SafeAreaView>
    )
}

export default Home;