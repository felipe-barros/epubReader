import React, { useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
// Caminho para o arquivo base html (iOS)
import iosFilePath from '../../templates/teste.html';

function Reader({ route }) {
    const { title, path } = route.params;
    const webview = useRef();
    // JavaScript que será rodado antes da página ser renderizada
    const injectedJS = '';

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <WebView
                ref={webview}
                source={iosFilePath}
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
            />
        </View>
    )
}

export default Reader;