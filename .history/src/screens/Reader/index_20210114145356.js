import React, { useRef } from 'react';
import { Button, Platform, SafeAreaView, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
// Caminho para o arquivo base html (iOS)
import iosFilePath from '../../templates/teste.html';
import themeToStyles from '../../utils/themeToStyles';

const lightMode = {
    bg: '#FFF',
    fg: '#000',
    size: '100%',
};

const darkMode = {
    bg: '#000 !important',
    fg: '#FFF !important',
    size: '100%',
}

function Reader({ route }) {
    var { path } = route.params;
    path = require(path)
    const webview = useRef();
    // JavaScript que será rodado antes da página ser renderizada
    let injectedJS = `window.BOOK_PATH = "${path}"; window.THEME = ${JSON.stringify(themeToStyles(lightMode))};`;
    console.log(injectedJS)
    // Path para o arquivo html de leitura do livro
    const pathToHtml = Platform.OS == 'ios' ? iosFilePath : { uri: 'file:///android_asset/index.html' }

    function handleMessage(msg) {
        let parsedData = JSON.parse(msg.nativeEvent.data);
        let { type } = parsedData;

        delete parsedData.type;
        switch (type) {
            case 'teste':
                const dados = parsedData.dados;
                console.log(dados)
                return;
            default:
                return;
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ flex: 1 }}>
                <WebView
                    ref={webview}
                    source={pathToHtml}
                    originWhitelist={["*"]}
                    injectedJavaScriptBeforeContentLoaded={injectedJS}
                    scrollEnabled={false}
                    startInLoadingState
                    onLoadProgress={({ nativeEvent }) => {
                        console.log(nativeEvent.progress);
                    }}
                    allowFileAccess={true}
                    onMessage={handleMessage}
                />
            </View>
            <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: Platform.OS == 'ios' ? 0 : 20 }}>
                <Button title='Anterior' />
                <Text>1 de 100</Text>
                <Button title='Próxima' />
            </SafeAreaView>
        </View >
    )
}

export default Reader;