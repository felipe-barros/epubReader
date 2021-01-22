import React, { useRef, useState } from 'react';
import { Button, FlatList, Modal, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import htmlPathIos from '../../templates/index.html';
import themeToStyles from '../../utils/themeToStyles';
import ModalNote from '../ModalNote';
import style from './style';
const lightMode = {
    bg: '#FFF !important',
    fg: '#000 !important',
    size: '125%',
};

const darkMode = {
    bg: '#000 !important',
    fg: '#FFF !important',
    size: '125%',
}

function Reader({ navigation, route }) {
    const { title, path } = route.params;
    const webview = useRef();
    const fontSizes = ["25%", "50%", "75%", "100%", "125%", "150%", "175%", "200%"];
    const [fontSizeIndex, setFontSizeIndex] = useState(4); // Tamanho de fonte original (100%)
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
    const [totalPages, setTotalPages] = useState(1);
    const [progress, setProgress] = useState(1);
    const [locations, setLocations] = useState(null);
    const [isModalVisibleNote, setIsModalVisibleNote] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [notesList, setNotesList] = useState([]);

    let injectedJS = `window.BOOK_PATH = "${path}"; window.THEME = ${JSON.stringify(themeToStyles(theme))};`;
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

    function refresh(tema) {
        webview.current?.injectJavaScript(`
        window.THEME = ${JSON.stringify(themeToStyles(tema))};
        window.rendition.themes.register({ theme: window.THEME });
        window.rendition.themes.select('theme'); 
        window.rendition.views().forEach(view => view.pane ? view.pane.render() : null)
        `);
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

    function isEarler(c1, c2) {
        c1 = c1.split('/');
        // Início e Fim do primeiro CFI
        var c1Inicio = c1[c1.length - 2];
        var c1Fim = c1[c1.length - 1];
        c1Fim = c1Fim.slice(0, c1Fim.length - 2);
        // Início e Fim do segundo CFI
        var c2Inicio = c2[c2.length - 2];
        var c2Fim = c2[c2.length - 1];
        c2Fim = c2Fim.slice(0, c2Fim.length - 2);
    }

    function highlightText(c, data = "") {
        var newNotesList = notesList;

        // newNotesList.forEach((c2) => {
        //     isEarler(c, c2);
        // });
        console.log(c);
        newNotesList.push({ cfi: c, data });
        setNotesList(newNotesList);

        webview.current?.injectJavaScript(`
        window.rendition.annotations.remove("${c}", "highlight");
        window.rendition.annotations.highlight("${c}", {data: "${data}"}, (e) => {
			console.log("highlight clicked", e.target);
        }, "", { "fill": "dodgerblue" });
        true`);
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
        refresh(newTheme);
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
        refresh(newTheme);
    }

    function goOpenConfig() {
        setisModalVisibleFont(true);
    }

    function goSearch() {
        setSearchedWord(search);
        setSearchResults([]);
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
            case 'highlight':
                highlightText(parsedData.cfi);
            case 'highlightClicked':
                if (parsedData.cfi != undefined)
                    return;

                setCurrentNote(parsedData.data);
                setIsModalVisibleNote(true);
                return;
            default:
                return;
        }
    }

    function goDarkMode(value) {
        if (value == 2 && isDarkMode == false) {
            var newTheme = darkMode;
            newTheme.size = fontSizes[fontSizeIndex];
            setIsDarkMode(true);
            setTheme(newTheme);
            setThemeStyle({ backgroundColor: '#000' });
            setFontStyle({ color: '#FFF' });
            refresh(darkMode);
        }
        else if (value == 1 && isDarkMode == true) {
            var newTheme = lightMode;
            newTheme.size = fontSizes[fontSizeIndex];
            setIsDarkMode(false);
            setTheme(newTheme);
            setThemeStyle({ backgroundColor: '#FFF' });
            setFontStyle({ color: '#000' });
            refresh(lightMode);
        }

    }

    function renderResult({ item }) {
        const v = item.excerpt.toUpperCase().indexOf(searchedWord.toUpperCase());

        return (
            <TouchableOpacity style={[style.resultFound]} activeOpacity={0.4} onPress={() => goToLocation(item.cfi)}>
                <Text style={[style.resultFoundTitle, fontStyle]}>{item.excerpt.slice(0, v)}<Text style={[style.resultFoundTitleBold, fontStyle, { color: '#000' }]}>{item.excerpt.slice(v, v + searchedWord.length)}</Text>{item.excerpt.slice(v + searchedWord.length, item.excerpt.length)}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={[style.container, themeStyle]}>
            <View style={style.content}>
                <View style={style.header}>
                    <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.goBack()}>
                        <Icon name="chevron-back-outline" size={35} color={isDarkMode ? '#FFF' : '#000'} />
                    </TouchableOpacity>
                    <Text style={[{ fontSize: 20, fontWeight: '500' }, fontStyle]}>{title}</Text>
                    <TouchableOpacity style={{ padding: 10 }}>
                        <Icon name="bookmark-outline" size={30} color={isDarkMode ? '#FFF' : '#000'} style={style.iconMargin} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
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
                        allowUniversalAccessFromFileURLs={true}
                        allowFileAccessFromFileURLs={true}
                        allowFileAccess
                    />
                </View>
            </View>
            <View style={style.footer}>
                <TouchableOpacity onPress={goPrev} style={{ padding: 20 }}>
                    <Icon name="chevron-back-outline" color={isDarkMode ? '#FFF' : '#000'} size={35} />
                </TouchableOpacity>
                <Text style={[style.footerText, fontStyle, { position: 'absolute', left: 100, right: 100 }]}>{progress} de {totalPages}</Text>
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
                <View style={[style.modalContainer]}>
                    <View style={[style.resultsContainer, { backgroundColor: isDarkMode ? '#666' : '#FFF' }]}>
                        <View style={style.resultHeader}>
                            <View></View>
                            <Text style={[style.resultTitle, fontStyle, { position: 'absolute', left: 0, right: 0, textAlign: 'center' }]}>Configurações de Leitura</Text>
                            <Button title="Voltar" onPress={() => setisModalVisibleFont(false)} />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={[{ fontSize: 18, textAlign: 'center' }, fontStyle]}>Tema de Leitura</Text>
                            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                                <TouchableOpacity style={{ marginRight: 50 }} onPress={() => goDarkMode(1)} >
                                    <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#fafafa', borderColor: 'lightgray', borderWidth: 1 }}></View>
                                    <Text style={[{ fontSize: 18, textAlign: 'center' }, fontStyle]}>Padrão</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => goDarkMode(2)} >
                                    <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#444', borderColor: 'lightgray', borderWidth: 1 }}></View>
                                    <Text style={[{ fontSize: 18, textAlign: 'center' }, fontStyle]}>Escuro</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ marginTop: 40 }}>
                            <Text style={[{ fontSize: 18, textAlign: 'center' }, fontStyle]}>Tamanho da Fonte</Text>
                            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={{ marginRight: 40 }} onPress={decreaseFontSize} >
                                    <View style={[{ justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 30, borderColor: 'lightgray', borderWidth: 1 }, themeStyle]}>
                                        <Text style={[{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }, fontStyle]}>-</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={increaseFontSize} >
                                    <View style={[{ justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 30, borderColor: 'lightgray', borderWidth: 1 }, themeStyle]}>
                                        <Text style={[{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }, fontStyle]}>+</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
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
                    <View style={[style.resultsContainer, { backgroundColor: isDarkMode ? '#666' : '#FFF' }]}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                            <TextInput value={search} placeholder='Buscar palavra' onChangeText={setSearch} style={{ padding: 10, borderRadius: 5, backgroundColor: 'lightgray', flex: 1 }} placeholderTextColor='#000' />
                            <View style={{ width: 20 }}></View>
                            <Button title="Buscar" onPress={goSearch} style={{ width: '100%' }} />
                            <View style={{ width: 20 }}></View>
                            <Button title="Voltar" onPress={() => setisModalVisibleSearch(false)} style={{ width: '100%' }} />
                        </View>
                        <FlatList
                            data={searchResults}
                            renderItem={renderResult}
                            keyExtractor={(item, index) => index.toString()} />
                    </View>
                </View>
            </Modal>
            <ModalNote
                isModalVisible={isModalVisibleNote}
                toggleModal={setIsModalVisibleNote}
                currentNote={currentNote}
                isDarkMode={isDarkMode}
                saveNote={highlightText} />
        </SafeAreaView>
    )
}

export default Reader;