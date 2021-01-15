import React, { useEffect, useRef } from 'react';
import { Button, Platform, SafeAreaView, Text, View } from 'react-native';
import { ExternalStorageDirectoryPath } from 'react-native-fs';
import StaticServer from 'react-native-static-server';
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

const serverConfig = { localOnly: true, keepAlive: true };

function Reader({ route }) {
    var { path } = route.params;
    const webview = useRef();
    // JavaScript que será rodado antes da página ser renderizada
    let injectedJS = `window.BOOK_PATH = "${path}"; window.THEME = ${JSON.stringify(themeToStyles(lightMode))};`;
    console.log(injectedJS)
    // Path para o arquivo html de leitura do livro
    const pathToHtml = Platform.OS == 'ios' ? iosFilePath : { uri: 'file:///android_asset/index.html' }

    useEffect(() => {
        console.log('Opening book');
        let newServer = new StaticServer(0, ExternalStorageDirectoryPath, serverConfig);
        newServer.start().then((url) =>
            // setState({
            // 	bookUrl: url + params.url.replace(ExternalStorageDirectoryPath, ''),
            // 	server: newServer
            // })
            console.log(url + path.replace(ExternalStorageDirectoryPath, ''))
        );
        return () => {
            // props.sortBook(params.index);
            // state.server && state.server.stop();
        };
    }, []);

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