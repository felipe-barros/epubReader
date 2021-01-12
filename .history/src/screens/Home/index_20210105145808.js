import React, { useRef, useState } from 'react';
import { Button, FlatList, Modal, SafeAreaView, Text, TextInput, View } from 'react-native';
import { WebView } from 'react-native-webview';
import html from '../../templates/index.html';
import themeToStyles from '../../utils/themeToStyles';
import style from './style';

function Home() {
    const webview = useRef();
    const fontSizes = ["25%", "50%", "75%", "100%", "125%", "150%", "175%", "200%"];
    const [fontSizeIndex, setFontSizeIndex] = useState(3); // Tamanho de fonte original (100%)
    const [theme, setTheme] = useState({
        bg: '#FFF',
        fg: '#000',
        size: '100%',
    })
    const [cl, setCl] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    let injectedJS = `window.BOOK_PATH = "../books/book2.epub"; window.THEME = ${JSON.stringify(themeToStyles(theme))};`;
    if (cl) {
        injectedJS = `${injectedJS}
		window.BOOK_LOCATION = "${cl}";
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

    function decreaseFontSize() {
        var newFontSizeIndex = fontSizeIndex;

        if (fontSizeIndex > 0) {
            newFontSizeIndex = fontSizeIndex - 1;
            setFontSizeIndex(newFontSizeIndex);
        }

        setTheme({
            bg: '#FFF',
            fg: '#000',
            size: fontSizes[newFontSizeIndex],
        });
        refresh();
    }

    function increaseFontSize() {
        var newFontSizeIndex = fontSizeIndex;

        if (fontSizeIndex < (fontSizes.length - 1)) {
            newFontSizeIndex = fontSizeIndex + 1;
            setFontSizeIndex(newFontSizeIndex);
        }

        setTheme({
            bg: '#FFF',
            fg: '#000',
            size: fontSizes[newFontSizeIndex],
        });
        refresh();
    }

    function goSearch() {
        webview.current?.injectJavaScript(`
		Promise.all(
			window.book.spine.spineItems.map((item) => {
				return item.load(window.book.load.bind(window.book)).then(() => {
					let results = item.find('${search}'.trim());
					item.unload();
					return Promise.resolve(results);
				});
			})
		).then((results) =>
			window.ReactNativeWebView.postMessage(
				JSON.stringify({ type: 'search', results: [].concat.apply([], results) })
			)
		); true`);
    }

    function handleMessage(msg) {
        let parsedData = JSON.parse(msg.nativeEvent.data);
        let { type } = parsedData;

        delete parsedData.type;

        switch (type) {
            case 'search':
                const results = parsedData.results;
                if (results.length > 0) {
                    setSearchResults(results)
                    setIsModalVisible(true);
                }
                return;
            case 'loc':
                setCl(parsedData.location);
                return;
            default:
                return;
        }
    }

    function renderResult({ item }) {
        return (
            <View style={style.resultFound}>
                <Text style={style.resultFoundTitle}>{item.excerpt}</Text>
            </View>
        )
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
                        handleMessage(event)
                    }}
                />
            </View>
            <View style={style.footer2}>
                <TextInput placeholder="Busca por palavra" onChangeText={setSearch} style={style.textInput} placeholderTextColor='#111' />
                <Button title='Buscar' color='#FFF' onPress={goSearch} disabled={search.length > 0 ? false : true} />
            </View>
            <View style={style.footer}>
                <Button title='Anterior' color='#FFF' onPress={goPrev} />
                <Button title='a-' color='#FFF' onPress={decreaseFontSize} />
                <Button title='A+' color='#FFF' onPress={increaseFontSize} />
                <Button title='Próxima' color='#FFF' onPress={goNext} />
            </View>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}>
                <View style={style.modalContainer}>
                    <View style={style.resultsContainer}>
                        <View style={style.resultHeader}>
                            <View></View>
                            <Text style={style.resultTitle}>{searchResults.length} resultado(s) encontrado(s)</Text>
                            <Button title="Voltar" onPress={() => setIsModalVisible(false)} />
                        </View>
                        <FlatList
                            data={searchResults}
                            renderItem={renderResult}
                            keyExtractor={(item, index) => index.toString()} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default Home;