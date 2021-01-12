import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20
    },
    header: {
        backgroundColor: '#000',
    },
    headerContent: {
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerSide: {
        flexDirection: 'row',
    },
    iconMargin: {
        marginLeft: 20
    },
    footer: {
        justifyContent: 'center'
    },
    footerText: {
        color: '#FFF'
    },
    textInput: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        borderRadius: 5
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    resultsContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: 300,
        paddingTop: 20,
        paddingHorizontal: 20,
        borderRadius: 20
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    resultTitle: {
        fontSize: 18
    },
    resultFound: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    },
    resultFoundTitle: {
        fontSize: 16,
    },
    resultFoundTitleBold: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})