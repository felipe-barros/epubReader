import React, { useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
// Caminho para o arquivo base html (iOS)
import iosFilePath from '../../templates/teste.html';
function Loading() {
    return (
        <View>
            <ActivityIndicator size="small" color="#000" />
        </View>
    )
}

function Reader({ route }) {
    const { title, path } = route.params;
    const webview = useRef();
    // JavaScript que será rodado antes da página ser renderizada
    const injectedJS = '';

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ height: 0 }}>
                <WebView
                    ref={webview}
                    source={iosFilePath}
                    originWhitelist={["*"]}
                    injectedJavaScriptBeforeContentLoaded={injectedJS}
                    scrollEnabled={false}
                    startInLoadingState
                    renderLoading={() => <Loading />}
                    onLoadProgress={({ nativeEvent }) => {
                        console.log(nativeEvent.progress);
                    }}
                    onLoadStart={(syntheticEvent) => {
                        // update component to be aware of loading status
                        console.log("Start Loading")
                    }}
                    onLoadEnd={(syntheticEvent) => {
                        console.log("End Loading")
                    }}
                    style={{ backgroundColor: '#000' }}
                />
            </View>
        </View >
    )
}

export default Reader;