import React, { useRef } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
// Caminho para o arquivo base html (iOS)
import iosFilePath from '../../templates/teste.html';

function Reader({ route }) {
    const { title, path } = route.params;
    const webview = useRef();
    // JavaScript que será rodado antes da página ser renderizada
    const injectedJS = '';
    // Path para o arquivo html de leitura do livro
    const pathToHtml = Platform.OS == 'ios' ? iosFilePath : { uri: 'file:///android_asset/teste.html' }

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
                />
            </View>
        </View >
    )
}

export default Reader;