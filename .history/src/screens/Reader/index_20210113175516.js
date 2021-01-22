import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
// Caminho para o arquivo base html (iOS)
import iosFilePath from '../../templates/teste.html';

function Reader({ route }) {
    const { title, path } = route.params;
    const webview = useRef();
    const [isLoading, setIsLoading] = useState(true);
    const [webViewFlex, setWebViewFlex] = useState(1)
        ;
    // JavaScript que será rodado antes da página ser renderizada
    const injectedJS = '';

    function webViewDidStartLoading() {
        setIsLoading(true)
    };

    function webViewDidEndLoading() {
        setIsLoading(false);
        setWebViewFlex(1);
        ;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ flex: webViewFlex }}>
                <WebView
                    ref={webview}
                    source={iosFilePath}
                    originWhitelist={["*"]}
                    injectedJavaScriptBeforeContentLoaded={injectedJS}
                    scrollEnabled={false}
                    startInLoadingState
                    onLoadStart={webViewDidStartLoading}
                    onLoadEnd={webViewDidEndLoading}
                    style={{ backgroundColor: '#000' }}
                />
            </View>
        </View >
    )
}

export default Reader;