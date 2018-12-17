import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textSubTitle: {
        fontSize: 16,
        color: Colors.textMain,
        marginVertical: 20
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }

});