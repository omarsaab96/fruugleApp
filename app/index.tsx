import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import i18n from '../i18n';


export default function IndexScreen() {
    const router = useRouter();
    let colorScheme = useColorScheme();
    const styles = styling(colorScheme);

    const { t } = useTranslation();

    const switchLanguage = () => {
        if (i18n.language == 'en') {
            i18n.changeLanguage('it')
        } else {
            i18n.changeLanguage('en')
        }
    }

    return (
        <View style={styles.appContainer}>
            <TouchableOpacity onPress={() => { switchLanguage() }}>
                <Text>{i18n.language == 'en' ? 'italian' : 'english'}</Text>
            </TouchableOpacity>

            <Text>{t('welcome')}</Text>
        </View>
    );
}


const styling = (colorScheme: string) =>
    StyleSheet.create({
        appContainer: {
            flex: 1,
            paddingTop: 100,
            backgroundColor: colorScheme === 'dark' ? '#111827' : '#f3f3f3',
        },
    });