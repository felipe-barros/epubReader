import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: '#000'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    footer2: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10
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