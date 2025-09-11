import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground, StyleSheet, Text, useColorScheme } from 'react-native';


export default function AppSplash() {
  const { t } = useTranslation();
  const router = useRouter();
  let colorScheme = useColorScheme();


  return (
    <ImageBackground
      source={require('../assets/images/splashBG.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <Image
        source={require("../assets/images/splashLogo.png")}
        style={styles.logo}
      />
      <Text style={styles.text}>
        {t('splashText')}
      </Text>
      <Image
        source={require("../assets/images/loader.gif")}
        style={styles.gif}
      />
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50
  },
  gif: {
    width: 300,
    height: 300,
  },
  logo: {
    width: 420,
    height: 'auto',
    objectFit: "contain",
    aspectRatio: 1.32
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Avenir',
    textAlign: 'center'
  }
});
