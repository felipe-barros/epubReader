import React, { useRef, useState } from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import html from '../../templates/index.html';
import themeToStyles from '../../utils/themeToStyles';
import style from './style';

const estilo = {
    bg: '#9e4321',
    fg: '#9e4321',
    font: 'Default',
    size: '150%',
    height: 'normal'
}
function Home() {
    const [fontSize, setFontSize] = useState("100%");
    const webview = useRef();

    // let injectedJS = `window.BOOK_PATH = "../books/book.epub"; window.THEME = ${JSON.stringify(themeToStyles(estilo))};`;
    let injectedJS = `window.BOOK_PATH = "../books/book.epub";`;
    function goPrev() {
        webview.current?.injectJavaScript(`window.rendition.prev(); true`);
    }

    function goNext() {
        webview.current?.injectJavaScript(`window.rendition.next(); true`);
    }

    function refresh() {
        webview.current?.reload();
    }

    function decreaseFontSize() {
        setFontSize("10%");
        webview.current?.injectJavaScript(`
		window.rendition.themes.register({ theme: "${JSON.stringify(themeToStyles({ size: "50%" }))}" });
        window.rendition.themes.select('theme')`);
        refresh();
    }

    function increaseFontSize() {
        setFontSize("200%");
        webview.current?.injectJavaScript(`
		window.rendition.themes.register({ theme: "${JSON.stringify(themeToStyles({ size: "300%" }))}" });
        window.rendition.themes.select('theme')`);
        refresh();
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