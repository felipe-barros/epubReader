import React, { useRef, useState } from 'react';
import { Button, FlatList, Modal, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import htmlPathIos from '../../templates/index.html';
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
    const [theme, setTheme] = useState(lightMode);
    const [cl, setCl] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [search, setSearch] = useState('');
    const [searchedWord, setSearchedWord] = useState('');
    const [isModalVisibleFont, setisModalVisibleFont] = useState(false);
    const [isModalVisibleSearch, setisModalVisibleSearch] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [themeStyle, setThemeStyle] = useState({ backgroundColor: '#FFF' });
    const [fontStyle, setFontStyle] = useState({ color: '#000' })
    const [lastMarkedCfi, setLastMarkedCfi] = useState("");
    const [totalPages, setTotalPages] = useState(-1);
    const [progress, setProgress] = useState(-1);
    const [locations, setLocations] = useState(null);

    let injectedJS = `window.BOOK_PATH = "https://s3.amazonaws.com/moby-dick/OPS/package.opf"; window.THEME = ${JSON.stringify(themeToStyles(theme))};`;
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
        }, "", {"fill": "yellow"});
        true`);
        setLastMarkedCfi(href);
        setisModalVisibleSearch(false);
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
        setSearchedWord(search);

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
                }
                return;
            case 'loc':
                // console.log(parsedData.progress, parsedData.totalPages)
                setTotalPages(parsedData.totalPages);
                setProgress(parsedData.progress + 1)
                setCl(parsedData.cfi);
                return;
            case 'locations':
                setLocations(parsedData.locations);
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
            setThemeStyle({ backgroundColor: '#000' });
            setFontStyle({ color: '#FFF' });
        }
        else {
            var newTheme = lightMode;
            newTheme.size = fontSizes[fontSizeIndex];
            setIsDarkMode(false);
            setTheme(newTheme);
            setThemeStyle({ backgroundColor: '#FFF' });
            setFontStyle({ color: '#000' });
        }
        refresh();
    }

    function renderResult({ item }) {
        const splittedText = item.excerpt.split(searchedWord);

        return (
            <TouchableOpacity style={style.resultFound} activeOpacity={0.4} onPress={() => goToLocation(item.cfi)}>
                <Text style={style.resultFoundTitle}>{splittedText[0]}<Text style={style.resultFoundTitleBold}>{searchedWord}</Text>{splittedText[1]}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={[style.container, themeStyle]}>
            <View style={style.content}>
                <View style={style.header}>
                    <TouchableOpacity style={{ padding: 10 }}>
                        <Icon name="chevron-back-outline" size={35} color={isDarkMode ? '#FFF' : '#000'} />
                    </TouchableOpacity>
                    <Text style={[{ fontSize: 20, fontWeight: '500' }, fontStyle]}>Knight Without Armour</Text>
                    <TouchableOpacity style={{ padding: 10 }}>
                        <Icon name="bookmark-outline" size={30} color={isDarkMode ? '#FFF' : '#000'} style={style.iconMargin} />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 20, flex: 1 }}>
                    <WebView
                        ref={webview}
                        source={Platform.OS == 'ios' ? htmlPathIos : { uri: 'file:///android_asset/index.html' }}
                        injectedJavaScriptBeforeContentLoaded={injectedJS}
                        originWhitelist={['*']}
                        allowUniversalAccessFromFileURLs={true}
                        scrollEnabled={false}
                        onMessage={(event) => {
                            handleMessage(event)
                        }}
                        style={{ backgroundColor: isDarkMode ? '#000' : '#FFF' }}
                    />
                </View>
            </View>
            <View style={style.footer}>
                <TouchableOpacity onPress={goPrev} style={{ padding: 10 }}>
                    <Icon name="chevron-back-outline" color={isDarkMode ? '#FFF' : '#000'} size={35} />
                </TouchableOpacity>
                <Text style={[style.footerText, fontStyle, { position: 'absolute', left: 0, right: 0 }]}>{progress} de {totalPages}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={goOpenConfig} style={{ padding: 10, marginRight: 20 }}>
                        <Icon name="text-outline" size={30} color={isDarkMode ? '#FFF' : '#000'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setisModalVisibleSearch(true)} style={{ padding: 10, marginRight: 20 }}>
                        <Icon name="search-outline" size={30} color={isDarkMode ? '#FFF' : '#000'} style={style.iconMargin} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goNext} style={{ padding: 10 }}>
                        <Icon name="chevron-forward-outline" color={isDarkMode ? '#FFF' : '#000'} size={35} />
                    </TouchableOpacity>
                </View>
            </View>
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
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 18 }}>Tema de Leitura</Text>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <View>
                                    <View style={{ width: 100, height: 100, borderRadius: 50, marginRight: 50, backgroundColor: '#fafafa', borderColor: 'lightgray', borderWidth: 1 }}></View>
                                    <Text style={{ fontSize: 18, textAlign: 'center' }}>Padrão</Text>
                                </View>
                                <View>
                                    <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#444', borderColor: 'lightgray', borderWidth: 1 }}></View>
                                    <Text style={{ fontSize: 18 }}>Escuro</Text>
                                </View>
                            </View>

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
                            <TextInput value={search} placeholder='Buscar palavra' onChangeText={setSearch} style={{ padding: 10, borderRadius: 5, backgroundColor: 'lightgray', width: '65%' }} placeholderTextColor='#000' />
                            <Button title="Buscar" onPress={goSearch} style={{ width: '100%' }} />
                            <Button title="Voltar" onPress={() => setisModalVisibleSearch(false)} style={{ width: '100%' }} />
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