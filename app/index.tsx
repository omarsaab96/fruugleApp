import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import i18n from '../i18n';


export default function IndexScreen() {
      const router = useRouter();

    const { t } = useTranslation();

    const switchLanguage = () => {
        if (i18n.language == 'en') {
            i18n.changeLanguage('it')
        } else {
            i18n.changeLanguage('en')
        }
    }

    return (
        <View style={{ paddingTop: 100 }}>
            <TouchableOpacity onPress={() => { switchLanguage() }}>
                <Text>{i18n.language == 'en' ? 'italian' : 'english'}</Text>
            </TouchableOpacity>

            <Text>{t('welcome')}</Text>
        </View>
    );
}