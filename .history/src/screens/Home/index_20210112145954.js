import React, { useRef, useState } from 'react';
import { Button, FlatList, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import html from '../../templates/index.html';
import themeToStyles from '../../utils/themeToStyles';
import style from './style';

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

function Home() {
    const webview = useRef();
    const fontSizes = ["25%", "50%", "75%", "100%", "125%", "150%", "175%", "200%"];
    const [fontSizeIndex, setFontSizeIndex] = useState(3); // Tamanho de fonte original (100%)
    const [theme, setTheme] = useState(darkMode);
    const [cl, setCl] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalVisibleFont, setisModalVisibleFont] = useState(false);
    const [isModalVisibleSearch, setisModalVisibleSearch] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [lastMarkedCfi, setLastMarkedCfi] = useState("");

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

    function goToLocation(href) {
        webview.current?.injectJavaScript(`
        window.rendition.display('${href}'); 
        window.rendition.annotations.remove("${lastMarkedCfi}", "highlight");
        window.rendition.annotations.highlight("${href}", {}, (e) => {
            console.log("highlight clicked", e.target);
        }, "", {"fill": "dodgerblue"});
        true`);
        setLastMarkedCfi(href);
        setisModalVisibleFont(false);
    }

    function decreaseFontSize() {
        var newFontSizeIndex = fontSizeIndex;

        if (fontSizeIndex > 0) {
            newFontSizeIndex = fontSizeIndex - 1;
            setFontSizeIndex(newFontSizeIndex);
        }

        var newTheme = theme;
        newTheme.size = fontSizes[newFontSizeIndex];

        setTheme(newTheme);
        refresh();
    }

    function increaseFontSize() {
        var newFontSizeIndex = fontSizeIndex;

        if (fontSizeIndex < (fontSizes.length - 1)) {
            newFontSizeIndex = fontSizeIndex + 1;
            setFontSizeIndex(newFontSizeIndex);
        }

        var newTheme = theme;
        newTheme.size = fontSizes[newFontSizeIndex];

        setTheme(newTheme);
        refresh();
    }

    function goOpenConfig() {
        setisModalVisibleFont(true);
    }

    function goSearch() {
        console.log('searching...')
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
                console.log('aa')
                const results = parsedData.results;
                if (results.length > 0) {
                    setSearchResults(results)
                    setisModalVisibleFont(true);
                }
                return;
            case 'loc':
                setCl(parsedData.location);
                return;
            default:
                return;
        }
    }

    function goDarkMode() {
        if (!isDarkMode) {
            var newTheme = darkMode;
            newTheme.size = fontSizes[fontSizeIndex];
            setIsDarkMode(true);
            setTheme(newTheme);
        }
        else {
            var newTheme = lightMode;
            newTheme.size = fontSizes[fontSizeIndex];
            setIsDarkMode(false);
            setTheme(newTheme);
        }
        refresh();
    }

    function renderResult({ item }) {
        const splittedText = item.excerpt.split(search);

        return (
            <TouchableOpacity style={style.resultFound} activeOpacity={0.4} onPress={() => goToLocation(item.cfi)}>
                <Text style={style.resultFoundTitle}>{splittedText[0]}<Text style={style.resultFoundTitleBold}>{search}</Text>{splittedText[1]}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={style.container}>
            <View style={style.content}>
                <View style={style.header}>
                    <View style={style.headerContent}>
                        <View style={style.headerSide}>
                            <Icon name="chevron-back-outline" size={30} color="#FFF" />
                            <Icon name="list-outline" size={30} color="#FFF" style={style.iconMargin} />
                        </View>
                        <View style={style.headerSide}>
                            <Icon name="text-outline" size={30} color="#FFF" onPress={() => goOpenConfig()} />
                            <Icon name="search-outline" size={30} color="#FFF" style={style.iconMargin} onPress={() => setisModalVisibleSearch(true)} />
                            <Icon name="bookmark-outline" size={30} color="#FFF" style={style.iconMargin} />
                        </View>
                    </View>
                </View>
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
            <View style={style.footer}>
                <Text style={style.footerText}>28 de 256</Text>
            </View>
            {/* <View style={style.footer2}>
                <TextInput placeholder="Busca por palavra" onChangeText={setSearch} style={style.textInput} placeholderTextColor='#111' />
                <Button title='Buscar' color='#FFF' onPress={goSearch} disabled={search.length > 0 ? false : true} />
            </View>
            <View style={style.footer}>
                <Button title='Anterior' color='#FFF' onPress={goPrev} />
                <Button title='a-' color='#FFF' onPress={decreaseFontSize} />
                <Button title='o' color='#FFF' onPress={goDarkMode} />
                <Button title='A+' color='#FFF' onPress={increaseFontSize} />
                <Button title='Próxima' color='#FFF' onPress={goNext} />
            </View> */}
            <Modal
                visible={isModalVisibleFont}
                animationType="slide"
                transparent={true}>
                <View style={style.modalContainer}>
                    <View style={style.resultsContainer}>
                        <View style={style.resultHeader}>
                            <View></View>
                            <Text style={style.resultTitle}>Ajustes</Text>
                            <Button title="Voltar" onPress={() => setisModalVisibleFont(false)} />
                        </View>
                        <Button title='Modo noturno' onPress={() => goDarkMode()} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Button title='a' style={{ marginRight: 20 }} onPress={() => decreaseFontSize()} />
                            <Button title='A' onPress={() => increaseFontSize()} />
                        </View>
                        {/* <FlatList
                            data={searchResults}
                            renderItem={renderResult}
                            keyExtractor={(item, index) => index.toString()} /> */}
                    </View>
                </View>
            </Modal>
            <Modal
                visible={isModalVisibleSearch}
                animationType="slide"
                transparent={true}>
                <View style={style.modalContainer}>
                    <View style={style.resultsContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TextInput placeholder='Buscar palavra' onChangeText={setSearch} style={{ padding: 10, borderRadius: 5, backgroundColor: 'lightgray', width: '65%' }} placeholderTextColor='#000' />
                            <Button title="Buscar" onPress={goSearch} style={{ width: '100%' }} />
                            <Button title="Voltar" onPress={() => setisModalVisibleSearch(false)} style={{ width: '100%' }} />
                        </View>
                        {
                            searchResults.length > 0 &&
                            <FlatList
                                data={searchResults}
                                renderItem={renderResult}
                                keyExtractor={(item, index) => index.toString()} />
                        }
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default Home;