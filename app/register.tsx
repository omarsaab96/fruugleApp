import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';


export default function RegisterScreen() {
    const router = useRouter();
    let colorScheme = useColorScheme();
    const styles = styling(colorScheme)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [nameTouched, setNameTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const [nameError, setNameError] = useState(true);
    const [emailError, setEmailError] = useState(true);
    const [passwordError, setPasswordError] = useState(true);

    const [respError, setRespError] = useState("");

    const checkName = (preferredname: string) => {
        let name = preferredname.trim();
        setName(name);

        if (name == "") {
            setNameError(true)
        } else {
            setNameError(false)
        }
    };

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

    const checkPassword = (password: string) => {
        let pass = password.trim()
        setPassword(pass)

        if (pass == "" || pass.length < 8) {
            console.log("Min 8 chars")
            setPasswordError(true)
            return;
        }

        let hasLetter = false;
        let hasNumber = false;

        for (let i = 0; i < pass.length; i++) {
            const char = pass[i];
            if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
                hasLetter = true;
            } else if (char >= '0' && char <= '9') {
                hasNumber = true;
            }
        }

        if (!hasLetter || !hasNumber) {
            console.log('should have letters and numbers');
            setPasswordError(true)
            return;
        }
        setPasswordError(false)
    };

    const { t } = useTranslation();

    // const switchLanguage = () => {
    //     if (i18n.language == 'en') {
    //         i18n.changeLanguage('it')
    //     } else {
    //         i18n.changeLanguage('en')
    //     }
    // }

    const handleRegister = () => {
        setRespError("No API")
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
            <TouchableOpacity style={styles.backBtn} onPress={() => { router.back() }}>
                <Image source={require('../assets/images/back.png')} style={styles.back} />
            </TouchableOpacity>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View>
                    <Text style={styles.title}>{t('registerTitle')}</Text>
                    <Text style={styles.subtitle}>{t('registerInstruction')}</Text>
                </View>

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
                        {nameError && nameTouched && <MaterialIcons name="error-outline" size={28} color="red" style={styles.error} />}
                        <TextInput
                            style={styles.input}
                            placeholder="Preferred Name"
                            placeholderTextColor="#707070"
                            keyboardType="default"
                            value={name}
                            onChangeText={(text => { checkName(text) })}
                            autoCapitalize="none"
                            onBlur={() => setNameTouched(true)}
                        />
                    </View>

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
                        {passwordError && passwordTouched && <MaterialIcons name="error-outline" size={28} color="red" style={styles.error} />}
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#707070"
                            secureTextEntry
                            value={password}
                            onChangeText={(text => { checkPassword(text) })}
                            onBlur={() => setPasswordTouched(true)}
                        />
                    </View>

                    <TouchableOpacity style={[styles.button, (nameError || emailError || passwordError) && { backgroundColor: '#707070' }]} onPress={() => handleRegister()} disabled={(nameError || emailError || passwordError)}>
                        <Text style={styles.buttonText}>{t('registerCTA')}</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={styles.forgot}>
                        <Text style={styles.forgotText}>Reset Password</Text>
                    </TouchableOpacity> */}
                </View>

                {/* <View style={styles.registerContainer}>
                    <TouchableOpacity style={styles.registerBtn}>
                        <Text style={styles.registerText}>New to the App?</Text>
                        <Text style={styles.registerLink}>Register</Text>
                        <Text style={styles.registerText}>here</Text>
                    </TouchableOpacity>
                </View> */}
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
        subtitle: {
            fontSize: 16,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            textAlign: 'center',
            paddingTop: 16
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
            marginBottom: 10
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
        },
        backBtn: {
            position: 'absolute',
            top: Platform.OS == 'ios' ? 60 : 40,
            left: 20,
            zIndex: 1,
        },
        back: {
            width: 11,
            height: 20,
            objectFit: 'contain'
        }
    });