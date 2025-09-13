import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

const API_URL = "http://10.0.2.2:5015/api";

export default function IndexScreen() {
    const router = useRouter();
    let colorScheme = useColorScheme();
    const styles = styling(colorScheme)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailTouched, setEmailTouched] = useState(false);
    const [emailError, setEmailError] = useState(true);

    const [loggingIn,setLoggingIn] = useState(false);
    const [respError, setRespError] = useState("");

    const checkEmail = (emailaddress: string) => {
        let email = emailaddress.trim();
        setEmail(email)
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email == "" || !regex.test(email)) {
            setEmailError(true)
        } else {
            setEmailError(false)
        }
    };

    const { t } = useTranslation();

    // const switchLanguage = () => {
    //     if (i18n.language == 'en') {
    //         i18n.changeLanguage('it')
    //     } else {
    //         i18n.changeLanguage('en')
    //     }
    // }

    const handleLogin = async () => {
        setLoggingIn(true)
        try {
            const url = `${API_URL}/users/Auth/login`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({
                    "username": email,
                    "password": password,
                }),
            });


            if (!response.ok) {
                throw new Error("Failed to login user");
            }

            const data = await response.json();
            await SecureStore.setItemAsync('token', data.token_type + " " + data.access_token);
            router.replace("/landing")
        } catch (error) {
            setLoggingIn(false)
            setRespError("Login failed");
            console.error("Login error:", error.message);
        }
    }
    return (
        // <View style={styles.appContainer}>
        //     <TouchableOpacity onPress={() => { switchLanguage() }}>
        //         <Text>{i18n.language == 'en' ? 'italian' : 'english'}</Text>
        //     </TouchableOpacity>

        //      <TouchableOpacity onPress={() => { router.push('splash') }}>
        //         <Text>splash screen</Text>
        //     </TouchableOpacity>

        //     <Text>{t('welcome')}</Text>
        // </View>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>{t('login')}</Text>

                <Image
                    style={styles.image}
                    source={require('../assets/images/cartLogo.png')}
                />

                <View>
                    {respError != "" && <View style={styles.respError}>
                        <MaterialIcons name="error-outline" size={18} color="red" />
                        <Text style={styles.respErrorText}>{respError}</Text>
                    </View>}
                    <View style={styles.inputEntity}>
                        {emailError && emailTouched && <MaterialIcons name="error-outline" size={28} color="red" style={styles.error} />}
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#707070"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={(text => { checkEmail(text) })}
                            autoCapitalize="none"
                            onBlur={() => setEmailTouched(true)}
                        />
                    </View>

                    <View style={styles.inputEntity}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#707070"
                            secureTextEntry
                            autoCapitalize='none'
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity style={[styles.button, (emailError) && { backgroundColor: '#707070' }]} onPress={() => handleLogin()} disabled={(emailError)}>
                        <Text style={styles.buttonText}>{loggingIn ? 'Logging in': 'Login'}</Text>
                        {loggingIn && <ActivityIndicator size='small' color='#fff' />}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgot}>
                        <Text style={styles.forgotText}>Reset Password</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.registerContainer}>
                    <TouchableOpacity style={styles.registerBtn} onPress={() => { router.push("/register") }}>
                        <Text style={styles.registerText}>New to the App?</Text>
                        <Text style={styles.registerLink}>Register</Text>
                        <Text style={styles.registerText}>here</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

    );
}


const styling = (colorScheme: string) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            paddingBottom: Platform.OS == 'ios' ? 30 : 40,
            paddingTop: Platform.OS == 'ios' ? 60 : 20

        },
        scrollContainer: {
            flexGrow: 1,
            justifyContent: "space-between",
            // alignItems: "center",
            padding: 40,
        },
        title: {
            fontSize: 16,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            textTransform: 'uppercase',
            textAlign: 'center'
        },
        image: {
            width: 210,
            height: 'auto',
            aspectRatio: 1.3,
            objectFit: 'contain',
            alignSelf: 'center'
        },
        inputEntity: {
            position: 'relative'
        },
        error: {
            position: 'absolute',
            right: 10,
            top: 11,
            zIndex: 1
        },
        input: {
            width: "100%",
            backgroundColor: "#E8F3F5",
            paddingVertical: 12,
            paddingHorizontal: 30,
            paddingRight: 50,
            borderRadius: 30,
            marginBottom: 15,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            fontFamily: 'Avenir',
            fontSize: 16,
        },
        button: {
            width: "100%",
            backgroundColor: "#155935",
            padding: 10,
            borderRadius: 30,
            alignItems: "center",
            marginTop: 10,
            marginBottom: 10,
            flexDirection:'row',
            gap:10,
            justifyContent:'center'
        },
        buttonText: {
            color: '#fff',
            fontFamily: 'Avenir',
            fontSize: 18,
        },
        forgot: {
            marginTop: 15,
        },
        forgotText: {
            color: colorScheme === 'dark' ? '#155935' : '#155935',
            fontSize: 16,
            fontFamily: 'Avenir',
            textAlign: 'center'
        },
        registerContainer: {
            flexDirection: "row",
            marginTop: 25,
            justifyContent: 'center'
        },
        registerBtn: {
            flexDirection: 'row',
            gap: 5
        },
        registerText: {
            color: colorScheme === 'dark' ? '#fff' : '#000',
            fontSize: 16,
            fontFamily: 'Avenir',
        },
        registerLink: {
            color: "#00C8F1",
            fontSize: 16,
            fontFamily: 'Avenir',
        },
        respError: {
            backgroundColor: 'rgba(255,0,0,0.1)',
            marginBottom: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
        },
        respErrorText: {
            color: 'red',
            fontFamily: 'Avenir',
            fontSize: 14,
        }
    });