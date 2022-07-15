import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',

    },
    title: {
        position: 'relative',
        top: 40,
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF'
    },
    input_wrapper: {
        flex: 44,
        position: 'relative',
        bottom: 20,
        width: '88%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
    },
    input: {
        height: 40,
        width: '88%',
        borderWidth: 1,
        borderColor: 'grey',
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 50,
        padding: 10
    },
    select: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083'
    },
    colorContainer: {
        width: '88%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    colorbutton: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    button_text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },
    button: {
        height: 40,
        width: '88%',
        alignItems: 'center',
        justifyContent: 'center',
        width: '88%',
        backgroundColor: '#757083'
    },
    image: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    // ----------------- CHAT SCREEN -----------------
    chat_title: {
        position: 'relative',
        top: 20,
        fontSize: 30,
        fontWeight: '600',
        color: '#C4D7E0'
    }
});

export { styles };