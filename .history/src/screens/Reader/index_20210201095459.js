import Slider from '@react-native-community/slider';
import 'moment/locale/pt-br';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Modal, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import ScreenBrightness from 'react-native-screen-brightness';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import htmlPathIos from '../../templates/index.html';
import themeToStyles from '../../utils/themeToStyles';
import ModalNote from '../ModalNote';
import ModalNotes from '../ModalNotes';
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
    const [totalPages, setTotalPages] = useState(null);
    const [progress, setProgress] = useState(1);
    const [locations, setLocations] = useState(null);
    const [isModalVisibleNote, setIsModalVisibleNote] = useState(false);
    const [isModalVisibleNoteList, setIsModalVisibleNoteList] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [notes, setNotes] = useState([]);
    const [pages, setPages] = useState([]);
    const [isMarked, setIsMarked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [brightness, setBrightness] = useState(0);

    useEffect(() => {
        ScreenBrightness.getBrightness().then((value) => {
            setBrightness(value);
        });
    }, []);

    let injectedJS = `window.BOOK_PATH = "${path}"; window.LOCATIONS = ${locations};window.THEME = ${JSON.stringify(themeToStyles(theme))};`;
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

    useEffect(() => {
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            if (page.cfi == cl) {
                setIsMarked(true);
                return;
            }
        }
        setIsMarked(false);
    }, [cl])

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
        window.LOCATIONS=${locations};
        window.rendition.display('${href}'); 
        window.rendition.annotations.remove("${lastMarkedCfi}", "highlight");
        window.rendition.annotations.highlight("${href}", {}, (e) => {}, "", {"fill": "yellow"});
        true`);
        setLastMarkedCfi(href);
        setisModalVisibleSearch(false);
    }

    function goToNote(cfi, page = false, newPage) {
        webview.current?.injectJavaScript(`
        window.LOCATIONS=${locations};
        window.rendition.display('${cfi}'); 
        true`);
        if (page) {
            setIsMarked(true);
        }
        setProgress(newPage);
    }

    function savePage() {
        var newPages = pages;
        if (isMarked) {
            var index = -1;
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                if (page.cfi == cl) {
                    index = i;
                    break;
                }

            }
            if (index > -1) {
                let newPages = pages;
                newPages.splice(index, 1);
                setPages(newPages);
                setIsMarked(false);
            }
        } else {
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                if (page.cfi == cl) {
                    index = i;
                    return;
                }
            }
            newPages.push({ progress, cfi: cl, date: new Date() });
            setIsMarked(true);
        }
    }

    function highlightText(data, color = 'dodgerblue') {
        var newNotes = notes;
        let currentDate = new Date();
        removeHighlight(data.cfi);
        newNotes.push({
            cfi: data.cfi,
            data: data.data,
            color: color,
            date: currentDate,
            text: data.text,
            page: progress
        })
        setNotes(newNotes);
        webview.current?.injectJavaScript(`
        window.rendition.annotations.remove("${data.cfi}", "highlight");
        window.rendition.annotations.add("highlight", "${data.cfi}", {data: "${data.data}"}, (e) => {}, "", { "fill": "${color}" });
        true`);
    }

    function removeHighlight(c) {
        let index = -1;

        for (let i = 0; i < notes.length; i++) {
            const note = notes[i];
            if (note.cfi == c) {
                index = i;
                break;
            }

        }
        if (index > -1) {
            let newNotes = notes;
            newNotes.splice(index, 1);
            setNotes(newNotes);
        }
        webview.current?.injectJavaScript(`
        window.rendition.annotations.remove("${c}", "highlight");
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

                setProgress(parsedData.progress + 1);
                setCl(parsedData.cfi);
                return;
            case 'locations':
                if (isLoading) {
                    setIsLoading(parsedData.isLoading);
                    setTotalPages(parsedData.totalPages)
                    setLocations(parsedData.locations);
                }
                return;
            case 'highlight':
                highlightText(parsedData.data);
                return;
            case 'highlightClicked':
                if (parsedData.cfi != undefined)
                    return;

                setCurrentNote(parsedData.data);
                setIsModalVisibleNote(true);
                return;
            case 'isLoading':
                setIsLoading(parsedData.isLoading);
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

    function goTeste() {
        if (locations) {
            const l = JSON.parse(locations);
            console.log(l[199]);
            goToLocation(l[199]);
        }
    }

    function changeBrightness(value) {
        ScreenBrightness.setBrightness(value);
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
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.goBack()}>
                            <Icon name="chevron-back-outline" size={35} color={isDarkMode ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => setIsModalVisibleNoteList(true)}>
                            <Icon name="list-outline" size={35} color={isDarkMode ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[{ fontSize: 20, fontWeight: '500' }, fontStyle]}>{title}</Text>
                    <TouchableOpacity style={{ padding: 10 }} onPress={savePage}>
                        <Icon name={isMarked ? "bookmark" : "bookmark-outline"} size={30} color={isDarkMode ? '#FFF' : '#000'} style={style.iconMargin} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    <WebView
                        ref={webview}
                        source={Platform.OS == 'ios' ? htmlPathIos : { uri: 'file:///android_asset/index.html' }}
                        injectedJavaScriptBeforeContentLoaded={injectedJS}
                        originWhitelist={['*']}
                        scrollEnabled={false}
                        onMessage={(event) => {
                            handleMessage(event)
                        }}
                        allowUniversalAccessFromFileURLs={true}
                        allowFileAccessFromFileURLs={true}
                        allowFileAccess
                        style={{ backgroundColor: isDarkMode ? '#000' : '#FFF' }}
                    />
                </View>
            </View>
            <View style={style.footer}>
                <TouchableOpacity onPress={goPrev} style={{ padding: 20 }}>
                    <Icon name="chevron-back-outline" color={isDarkMode ? '#FFF' : '#000'} size={35} />
                </TouchableOpacity>
                {
                    !totalPages ? (
                        <Text style={[style.footerText, fontStyle, { position: 'absolute', left: 100, right: 100 }]}>Calculando páginas...</Text>
                    ) :
                        <>
                            <TouchableOpacity style={{ position: 'absolute', left: 100, right: 100 }} onPress={() => alert("Slider")}>
                                <Text style={[style.footerText, fontStyle]}>{progress} de {totalPages}</Text>
                            </TouchableOpacity>
                            <View style={{ width: '100%', position: 'absolute', top: -40, left: 0, right: 0, alignItems: 'center' }}>
                                <Text style={[style.footerText, fontStyle]}>Página {progress}</Text>
                                <Slider
                                    minimumValue={0}
                                    maximumValue={1}
                                    minimumTrackTintColor="#307ecc"
                                    maximumTrackTintColor="#000000"
                                    step={0.1}
                                    value={brightness}
                                    onSlidingComplete={(brightness) => {
                                        setBrightness(brightness);
                                        changeBrightness(brightness);
                                    }}
                                    style={{ width: '50%', marginTop: 5 }}
                                />
                            </View>
                        </>
                }
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
            {
                isLoading && (
                    <View style={{ flex: 1, position: 'absolute', width: '100%', height: '100%', justifyContent: 'center' }}>
                        <ActivityIndicator color="#000" size='large' style={{ marginBottom: 10 }} />
                        <Text style={{ color: '#000', fontWeight: '500', textAlign: 'center' }}>Carregando...</Text>
                    </View>
                )
            }
            <Modal
                visible={isModalVisibleFont}
                animationType="slide"
                transparent={true}>
                <View style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={() => setisModalVisibleFont(false)} >
                        <View style={{ flex: 0.5, backgroundColor: 'rgba(0,0,0,0.5)' }}></View>
                    </TouchableWithoutFeedback>
                    <View style={[style.resultsContainer, { backgroundColor: isDarkMode ? '#666' : '#FFF' }]}>
                        <View style={style.resultHeader}>
                            <View></View>
                            <Text style={[style.resultTitle, fontStyle, { position: 'absolute', left: 0, right: 0, textAlign: 'center' }]}>Configurações de Leitura</Text>
                            <Button title="Voltar" onPress={() => setisModalVisibleFont(false)} />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={[{ fontSize: 18, textAlign: 'center' }, fontStyle]}>Brilho da Tela</Text>
                            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                                <Slider
                                    minimumValue={0}
                                    maximumValue={1}
                                    minimumTrackTintColor="#307ecc"
                                    maximumTrackTintColor="#000000"
                                    step={0.1}
                                    value={brightness}
                                    onSlidingComplete={(brightness) => {
                                        setBrightness(brightness);
                                        changeBrightness(brightness);
                                    }}
                                    style={{ width: '50%', height: 50 }}
                                />
                            </View>
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
                <View style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={() => setisModalVisibleSearch(false)} >
                        <View style={{ flex: 0.5, backgroundColor: 'rgba(0,0,0,0.5)' }}></View>
                    </TouchableWithoutFeedback>
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
                saveNote={highlightText}
                removeNote={removeHighlight}
            />
            <ModalNotes
                isModalVisible={isModalVisibleNoteList}
                toggleModal={setIsModalVisibleNoteList}
                notes={notes}
                isDarkMode={isDarkMode}
                pages={pages}
                goToNote={goToNote}
            />
        </SafeAreaView>
    )
}

export default Reader;