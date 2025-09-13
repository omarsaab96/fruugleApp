import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, ImageBackground, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfilingScreen() {
    const router = useRouter();
    let colorScheme = useColorScheme();
    const [step, setStep] = useState<string | null>(null);
    const styles = styling(colorScheme)
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const [showTimePicker, setShowTimePicker] = useState(false);



    const [selectedStyle, setSelectedStyle] = useState('Formal')
    const [selectedMode, setSelectedMode] = useState('')
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [time, setTime] = useState(new Date());
    const [threshold, setThreshold] = useState('0');
    const [specialOffer, setSpecialOffer] = useState(true);
    const [savingsBooster, setSavingsBooster] = useState(true);

    const [submitingStep1, setSubmitingStep1] = useState(false)
    const [submitingStep2, setSubmitingStep2] = useState(false)
    const [submitingStep3, setSubmitingStep3] = useState(false)


    useEffect(() => {
        const fetchUserInfo = async () => {
            const currentStep = await SecureStore.getItemAsync('currentStep');
            setStep(currentStep);
        };
        fetchUserInfo();
    }, []);

    const onChange = (_event: any, selectedDate?: Date) => {
        setShowTimePicker(Platform.OS === "ios"); // keep open on iOS, close on Android
        if (selectedDate) {
            setTime(selectedDate);
        }
    };

    const handleSkip = () => {
        router.replace('/landing')
    }

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleCompleteStep1 = async () => {
        setSubmitingStep1(true)
        const step1Info = {
            image: null
        }
        console.log(step1Info)
        setSubmitingStep1(false)
        await SecureStore.setItemAsync('currentStep', '2');
        setStep(await SecureStore.getItemAsync('currentStep'));

    }

    const handleCompleteStep2 = async () => {
        setSubmitingStep2(true)
        const step2Info = {
            style: selectedStyle,
            mode: selectedMode
        }
        console.log(step2Info)
        setSubmitingStep2(false)
        await SecureStore.setItemAsync('currentStep', '3');
        setStep(await SecureStore.getItemAsync('currentStep'));
    }

    const handleCompleteStep3 = async () => {
        setSubmitingStep3(true)
        const step3Info = {
            days: selectedDays,
            time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            threshold: parseInt(threshold),
            specialOffer: specialOffer,
            savingsBooster: savingsBooster
        }
        console.log(step3Info)
        setSubmitingStep3(false)
        await SecureStore.setItemAsync('currentStep', '4');
        setStep(await SecureStore.getItemAsync('currentStep'));
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.topNavBar}>
                <TouchableOpacity onPress={() => { router.back() }}>
                    <Image source={require('../assets/images/back.png')} style={styles.back} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { handleSkip() }}>
                    <Text style={styles.skipBtnText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.stepsProgress}>
                <View style={styles.stepsContainer}>
                    <View style={styles.stepsProgressLine}></View>

                    <View style={styles.step}>
                        <View style={[styles.stepNumber, styles.activeStepNumber]}>
                            <Text style={[styles.stepNumberText, styles.activeStepNumberText]}>
                                1
                            </Text>
                        </View>
                        <Text style={[styles.stepName, styles.activeStepName]}>
                            Profiling
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <View style={[styles.stepNumber, (step >= 4) && styles.activeStepNumber]}>
                            <Text style={[styles.stepNumberText, (step >= 4) && styles.activeStepNumberText]}>
                                2
                            </Text>
                        </View>
                        <Text style={[styles.stepName, (step >= 4) && styles.activeStepName]}>
                            Store Selection
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <View style={[styles.stepNumber, (step >= 5) && styles.activeStepNumber]}>
                            <Text style={[styles.stepNumberText, (step >= 5) && styles.activeStepNumberText]}>
                                3
                            </Text>
                        </View>
                        <Text style={[styles.stepName, (step >= 5) && styles.activeStepName]}>
                            Basket Creation
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <View style={[styles.stepNumber, (step >= 6) && styles.activeStepNumber]}>
                            <Text style={[styles.stepNumberText, (step >= 6) && styles.activeStepNumberText]}>
                                4
                            </Text>
                        </View>
                        <Text style={[styles.stepName, (step >= 6) && styles.activeStepName]}>
                            Transaction
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                {step == '1' &&
                    <View>
                        <Text style={styles.title}>{t('Add your Photo')}</Text>
                    </View>
                }

                {step == '2' &&
                    <View>
                        <Text style={styles.title}>{t('COMMUNICATION PREFERENCE')}</Text>
                        <Text style={[styles.paragraph, { marginBottom: 55 }]}>
                            Please select your preferred communication style and the model of conversation
                        </Text>
                        <Text style={[styles.paragraph, { textAlign: 'center', marginBottom: 20 }]}>
                            Preferred Conversation Style
                        </Text>

                        <View style={[styles.radioBtns, { justifyContent: 'center', marginBottom: 55 }]}>
                            <TouchableOpacity
                                style={[styles.radioBtn, selectedStyle == "Formal" && styles.radioBtnActive]}
                                onPress={() => { setSelectedStyle('Formal') }}>
                                <Text style={[styles.radioBtntext, selectedStyle == "Formal" && styles.radioBtnTextActive]}>
                                    Formal
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.radioBtn, selectedStyle == "Casual" && styles.radioBtnActive]}
                                onPress={() => { setSelectedStyle('Casual') }}>
                                <Text style={[styles.radioBtntext, selectedStyle == "Casual" && styles.radioBtnTextActive]}>
                                    Casual
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.mode}>
                            <Text style={[styles.paragraph, { color: '#fff', textAlign: 'center', marginBottom: 15 }]}>
                                Preferred Conversation Mode
                            </Text>

                            <View style={styles.modeOptions}>
                                <ImageBackground
                                    source={require('../assets/images/modebg.png')}
                                    style={[styles.modeOptions, { padding: 12 }]}
                                    resizeMode="cover"
                                >
                                    <TouchableOpacity
                                        onPress={() => { setSelectedMode('Voice') }}
                                        style={[styles.modeOption, selectedMode == "Voice" && styles.modeOptionActive]}
                                    >
                                        <Image
                                            source={require('../assets/images/mic.png')}
                                            style={[styles.modeOptionIcon, selectedMode == "Voice" && styles.modeOptionActive]}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { setSelectedMode('Text') }}
                                        style={[styles.modeOption, selectedMode == "Text" && styles.modeOptionActive]}
                                    >
                                        <Image
                                            source={require('../assets/images/msg.png')}
                                            style={[styles.modeOptionIcon, selectedMode == "Text" && styles.modeOptionActive]}
                                        />
                                    </TouchableOpacity>
                                </ImageBackground>

                            </View>
                        </View>
                    </View>
                }

                {step == '3' &&
                    <View>
                        <Text style={styles.title}>{t('NOTIFICATIONS, SPECIAL offers and optimized cart')}</Text>
                        <Text style={[styles.paragraph, { marginBottom: 10 }]}>
                            Choose preferred notifications days
                        </Text>

                        <View style={[styles.radioBtns, { gap: 6, marginBottom: 50, flexWrap: 'wrap' }]}>
                            {days.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    style={[
                                        styles.smallRadioBtn,
                                        selectedDays.includes(day) && styles.radioBtnActive,
                                    ]}
                                    onPress={() => toggleDay(day)}
                                >
                                    <Text
                                        style={[
                                            styles.radioBtntext,
                                            selectedDays.includes(day) && styles.radioBtnTextActive,
                                        ]}
                                    >
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
                            <Text style={styles.paragraph}>
                                Notification's Time
                            </Text>
                            <TouchableOpacity style={styles.picker} onPress={() => setShowTimePicker(true)}>
                                <Text style={styles.pickerText}>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                                <Image style={styles.pickerIcon} source={require('../assets/images/clock.png')} />
                            </TouchableOpacity>
                            {showTimePicker && (
                                <DateTimePicker
                                    value={time}
                                    mode="time"
                                    is24Hour={true}
                                    display={Platform.OS === "ios" ? "spinner" : "default"}
                                    onChange={onChange}
                                />
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
                            <Text style={styles.paragraph}>
                                Notification Threshold (€)
                            </Text>
                            <TextInput
                                value={threshold}
                                onChangeText={setThreshold}
                                style={[styles.input, { width: 114, textAlign: 'center' }]}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
                            <Text style={styles.paragraph}>
                                Special Offers
                            </Text>

                            <Pressable
                                style={[
                                    styles.toggle,
                                    specialOffer ? styles.toggleOn : styles.toggleOff,
                                ]}
                                onPress={() => setSpecialOffer((prev) => !prev)}
                            >
                                <View
                                    style={styles.knob}
                                />
                            </Pressable>

                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
                            <Text style={styles.paragraph}>
                                Savings Booster (Optimized Cart)
                            </Text>

                            <Pressable
                                style={[
                                    styles.toggle,
                                    savingsBooster ? styles.toggleOn : styles.toggleOff,
                                ]}
                                onPress={() => setSavingsBooster((prev) => !prev)}
                            >
                                <View
                                    style={styles.knob}
                                />
                            </Pressable>
                        </View>
                    </View>
                }

            </ScrollView>


            <View style={styles.stepButton}>
                <View style={styles.dots}>
                    <View style={[styles.dot, step == '1' && styles.activeDot]}></View>
                    <View style={[styles.dot, step == '2' && styles.activeDot]}></View>
                    <View style={[styles.dot, step == '3' && styles.activeDot]}></View>
                </View>

                {step == '1' &&
                    <TouchableOpacity
                        style={[styles.button, selectedMode == '' && { backgroundColor: '#707070' }]}
                        onPress={() => handleCompleteStep1()}
                        disabled={(selectedMode == '')}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                        {submitingStep1 && <ActivityIndicator size='small' color='#fff' />}
                    </TouchableOpacity>
                }
                {step == '2' &&
                    <TouchableOpacity
                        style={[styles.button, selectedMode == '' && { backgroundColor: '#707070' }]}
                        onPress={() => handleCompleteStep2()}
                        disabled={(selectedMode == '')}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                        {submitingStep2 && <ActivityIndicator size='small' color='#fff' />}
                    </TouchableOpacity>
                }
                {step == '3' &&
                    <TouchableOpacity
                        style={[styles.button, selectedDays.length == 0 && { backgroundColor: '#707070' }]}
                        onPress={() => handleCompleteStep3()}
                        disabled={(selectedDays.length == 0)}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                        {submitingStep3 && <ActivityIndicator size='small' color='#fff' />}
                    </TouchableOpacity>
                }
            </View>


        </KeyboardAvoidingView>
    );
}

const styling = (colorScheme: string) => {
    const insets = useSafeAreaInsets();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
        },
        topNavBar: {
            marginBottom: 30,
            paddingHorizontal: 32,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        skipBtnText: {
            fontSize: 16,
            fontFamily: 'Avenir',
            color: '#155935'
        },
        back: {
            width: 11,
            height: 20,
            objectFit: 'contain'
        },
        scrollContainer: {
            flexGrow: 1,
            paddingHorizontal: 32
        },
        stepsProgress: {
            paddingHorizontal: 32,
            marginBottom: 50
        },
        stepsContainer: {
            flexDirection: 'row',
            position: 'relative'
        },
        stepsProgressLine: {
            position: 'absolute',
            top: 12,
            left: '12.5%',
            width: '75%',
            backgroundColor: '#A6A6A6',
            height: 1
        },
        step: {
            alignItems: 'center',
            width: '25%',
        },
        stepNumber: {
            width: 25,
            height: 25,
            backgroundColor: '#D9D9D9',
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 5,
            outlineWidth: 4,
            outlineColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        activeStepNumber: {
            backgroundColor: '#155935',
        },
        activeStepNumberText: {
            color: "#fff"
        },
        stepNumberText: {
            fontFamily: 'Avenir',
            fontSize: 16,
            lineHeight: 25,
            textAlign: 'center',
            color: "#000"
        },
        stepName: {
            fontFamily: 'Avenir',
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 15,
            color: colorScheme === 'dark' ? '#A6A6A6' : '#000',
        },
        activeStepName: {
            color: colorScheme === 'dark' ? '#9BDEB2' : '#155935'
        },
        title: {
            fontSize: 16,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            textTransform: 'uppercase',
            marginBottom: 40,
            fontFamily: 'Avenir'
        },
        paragraph: {
            fontFamily: 'Avenir',
            color: colorScheme === 'dark' ? '#fff' : '#000',
            fontSize: 16,
        },
        radioBtns: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
        },
        radioBtn: {
            backgroundColor: '#D9D9D9',
            paddingHorizontal: 40,
            paddingVertical: 10,
            borderRadius: 30
        },
        smallRadioBtn: {
            backgroundColor: '#D9D9D9',
            paddingHorizontal: 20,
            paddingVertical: 2,
            borderRadius: 30,
            width: 74,
        },
        radioBtnActive: {
            backgroundColor: '#155935'
        },
        radioBtntext: {
            fontFamily: 'Avenir',
            fontSize: 16,
            color: '#000',
            textAlign: 'center'
        },
        radioBtnTextActive: {
            color: '#fff'
        },
        mode: {
            backgroundColor: '#155935',
            paddingHorizontal: 25,
            paddingVertical: 15,
            borderRadius: 30
        },
        modeOptions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 22,
            justifyContent: 'center'
        },
        modeOption: {
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            padding: 20,
            borderRadius: 100
        },
        modeOptionActive: {
            backgroundColor: '#fff',
            tintColor: '#155935'
        },
        modeOptionIcon: {
            width: 24,
            height: 24,
            objectFit: 'contain'
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
            paddingHorizontal: 10,
            borderRadius: 30,
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
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'center'
        },
        stepButton: {
            paddingHorizontal: 32
        },
        dots: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
        },
        dot: {
            width: 10,
            height: 10,
            backgroundColor: '#D9D9D9',
            borderRadius: 10
        },
        activeDot: {
            backgroundColor: '#155935'
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
        picker: {
            backgroundColor: '#E8F3F5',
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 30,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5
        },
        pickerText: {
            fontSize: 16,
            fontFamily: 'Avenir'
        },
        pickerIcon: {
            width: 15,
            height: 15,
            objectFit: 'contain'
        },
        toggle: {
            width: 50,
            height: 30,
            borderRadius: 20,
            justifyContent: "center",
            padding: 5,
        },
        toggleOn: {
            backgroundColor: "#155935",
            alignItems: "flex-end",
        },
        toggleOff: {
            backgroundColor: "#D9D9D9",
            alignItems: "flex-start",
        },
        knob: {
            width: 20,
            height: 20,
            borderRadius: 15,
            backgroundColor: "#fff",
        },
    });
};