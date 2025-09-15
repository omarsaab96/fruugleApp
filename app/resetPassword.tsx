import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_URL = "http://10.0.2.2:5015/api";

export default function ResetPasswordScreen() {
    const router = useRouter();
    let colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const styles = styling(colorScheme,insets)
    

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");

    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmationPasswordTouched, setConfirmationPasswordTouched] = useState(false);

    const [emailverified, setEmailverified] = useState(false);

    const [emailError, setEmailError] = useState(true);
    const [passwordError, setPasswordError] = useState(true);
    const [passwordConfirmationError, setPasswordConfirmationError] = useState(true);

    const [verifyingEmail, setVerifyingEmail] = useState(false);
    const [resettingPassword, setResettingPassword] = useState(false);

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

    const checkPassword = (password: string) => {
        let pass = password.trim()
        setPassword(pass)

        if (pass == "" || pass.length < 8) {
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
            setPasswordError(true)
            return;
        }
        setPasswordError(false)
    };

    const checkConfirmationPassword = (confirmationPassword: string) => {
        let confirmationPass = confirmationPassword.trim()
        setConfirmationPassword(confirmationPass)

        if (confirmationPass != password) {
            setPasswordConfirmationError(true)
            return;
        }
        setPasswordConfirmationError(false)
    };

    const { t } = useTranslation();

    // const switchLanguage = () => {
    //     if (i18n.language == 'en') {
    //         i18n.changeLanguage('it')
    //     } else {
    //         i18n.changeLanguage('en')
    //     }
    // }

    const resetPassword = async () => {
        setResettingPassword(true)

        //these will be in the email reset link -> i must extract them on load
        const userId = '4ecda035-5b6a-4bf4-b736-39bbf28d2f13'
        const token = ''

        try {
            const url = `${API_URL}/users/Auth/${userId}/passwordReset`;

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({
                    "token": token,
                    "newPassword": password,
                    "confirmNewPassword": confirmationPassword
                }),
            });

            //     if (!response.ok) {
            //         throw new Error("Failed to reset password");
            //     }

            //     const data = await response.json();
            //     await SecureStore.setItemAsync('token', data.token_type + " " + data.access_token);
            //     await SecureStore.setItemAsync('refresh_token', data.refresh_token);
            //     await SecureStore.setItemAsync('email_verified', data.email_verified.toString());
            //     loginUser();
        } catch (error) {
            //     setResettingPassword(false)
            //     setRespError("Password reset failed");
            //     console.error("Password reset error:", error.message);
        }
    }

    const handleVerifyEmail = async () => {
        setVerifyingEmail(true)

        try {
            const url = `${API_URL}/users/Auth/requestPasswordReset/${email}`;

            const response = await fetch(url, {
                method: "HEAD",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to send password reset email");
            }
            setEmailverified(true)
            setVerifyingEmail(false)
        } catch (error) {
            setEmailverified(false)
            setVerifyingEmail(false)
            setRespError("An error occured. Please try again");
            console.error("Error Verifying email:", error.message);
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
                <View style={styles.topNavBar}>
                    <TouchableOpacity onPress={() => { router.back() }}>
                        <Image source={require('../assets/images/back.png')} style={styles.back} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>{t('resetPassword')}</Text>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        style={styles.image}
                        source={require('../assets/images/cartLogo.png')}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    {respError != "" && <View style={styles.respError}>
                        <MaterialIcons name="error-outline" size={18} color="red" />
                        <Text style={styles.respErrorText}>{respError}</Text>
                    </View>}

                    <View style={styles.inputEntity}>
                        {emailError && emailTouched && <MaterialIcons name="error-outline" size={28} color="red" style={styles.error} />}
                        <TextInput
                            style={[styles.input, emailverified && styles.inputDisabled]}
                            placeholder="Email"
                            placeholderTextColor="#707070"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={(text => { checkEmail(text) })}
                            autoCapitalize="none"
                            onBlur={() => setEmailTouched(true)}
                            editable={!emailverified}
                        />
                    </View>

                    {emailverified && <View style={styles.inputEntity}>
                        {passwordError && passwordTouched && <MaterialIcons name="error-outline" size={28} color="red" style={styles.error} />}
                        <TextInput
                            style={styles.input}
                            placeholder="New Password"
                            placeholderTextColor="#707070"
                            secureTextEntry
                            autoCapitalize='none'
                            value={password}
                            onChangeText={(text => { checkPassword(text) })}
                            onBlur={() => setPasswordTouched(true)}
                        />
                    </View>}

                    {emailverified && <View style={styles.inputEntity}>
                        {passwordConfirmationError && confirmationPasswordTouched && <MaterialIcons name="error-outline" size={28} color="red" style={styles.error} />}
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#707070"
                            secureTextEntry
                            autoCapitalize='none'
                            value={confirmationPassword}
                            onChangeText={(text => { checkConfirmationPassword(text) })}
                            onBlur={() => setConfirmationPasswordTouched(true)}
                        />
                    </View>}

                    {!emailverified && <TouchableOpacity
                        style={[styles.button, (emailError) && { backgroundColor: '#707070' }]}
                        onPress={() => handleVerifyEmail()}
                        disabled={(emailError || verifyingEmail)}>
                        <Text style={styles.buttonText}>
                            Next
                        </Text>
                        {verifyingEmail && <ActivityIndicator size='small' color='#fff' />}
                    </TouchableOpacity>
                    }

                    {emailverified && <TouchableOpacity
                        style={[styles.button, (passwordError || passwordConfirmationError) && { backgroundColor: '#707070' }]}
                        onPress={() => resetPassword()}
                        disabled={(passwordError || passwordConfirmationError || resettingPassword)}>
                        <Text style={styles.buttonText}>
                            {resettingPassword ? 'Resetting' : 'Reset'} Password
                        </Text>
                        {resettingPassword && <ActivityIndicator size='small' color='#fff' />}
                    </TouchableOpacity>
                    }

                </View>
            </ScrollView>
        </KeyboardAvoidingView >

    );
}

const styling = (colorScheme: string,insets:any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
            paddingBottom: Platform.OS == 'ios' ? 30 : 40,
            paddingTop: Platform.OS == 'ios' ? 60 : 20

        },
        scrollContainer: {
            flexGrow: 1,
            justifyContent: "space-between",
            // alignItems: "center",
            padding: 40,
            paddingTop:insets.top
        },
        topNavBar: {
            paddingHorizontal: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#fff',
            position: 'relative',
            zIndex: 1
        },
        back: {
            width: 11,
            height: 20,
            objectFit: 'contain'
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
        inputDisabled: {
            backgroundColor: '#D9D9D9'
        },
        button: {
            width: "100%",
            backgroundColor: "#155935",
            padding: 10,
            borderRadius: 30,
            alignItems: "center",
            marginTop: 10,
            marginBottom: 10,
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'center'
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