import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',

    },
    title: {
        flex: 10,

        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF'
    },
    input_wrapper: {
        flex: 44,
        width: '88%',
        justifyContent: 'space-evenly',
        alignItems: 'start',
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
        opacity: 50
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
    button: {
        height: 50,
        width: '88%',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        backgroundColor: 'green'
    },
    image: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    }
});

export { styles };