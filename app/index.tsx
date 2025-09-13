import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground, StyleSheet, Text, useColorScheme } from 'react-native';

export default function IndexScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  let colorScheme = useColorScheme();
  const API_URL = "http://10.0.2.2:5015/api";

  useEffect(() => {
    async function prepareApp() {

      try {

        // Check user session + refresh token if needed
        const token = await SecureStore.getItemAsync("token");
        const refreshToken = await SecureStore.getItemAsync("refresh_token");
        let validSession = false;

        if (token) {
          try {
            const url = `${API_URL}/users/Auth/checkSession`;

            const response = await fetch(url, {
              method: "HEAD",
              headers: {
                "Accept": "application/json",
                "Authorization": token,
              },
            });

            if (response.status === 200) {
              // Token is valid
              validSession = true;
            } else if (response.status != 200 && refreshToken) {
              // Token expired -> try refreshing
              const refreshUrl = `${API_URL}/users/Auth/token`;

              const refreshResponse = await fetch(refreshUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  "Authorization": token,
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
              });

              if (refreshResponse.ok) {
                const data = await refreshResponse.json();

                await SecureStore.setItemAsync('token', data.token_type + " " + data.access_token);
                await SecureStore.setItemAsync('refresh_token', data.refresh_token);
                validSession = true;
              }
            }
          } catch (error) {
            console.error("Session check failed:", error.message);
          }
        }

        if (validSession) {
          router.replace("/landing")
        } else {
          await SecureStore.deleteItemAsync("token");
          await SecureStore.deleteItemAsync("refresh_token");
          await SecureStore.deleteItemAsync("userID");
          await SecureStore.deleteItemAsync("email_verified");
          router.replace('/login')
        }

      } catch (e) {
        console.warn(e);
      }
    }

    setTimeout(() => {
      prepareApp();
    }, 3000)

  }, []);

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
