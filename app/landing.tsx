import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';


export default function landingScreen() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [step, setStep] = useState<string | null>(null);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("refresh_token");
        await SecureStore.deleteItemAsync("userID");
        await SecureStore.deleteItemAsync("email_verified");
        await SecureStore.deleteItemAsync("currentStep");
        router.replace("/");
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
            setToken(storedToken);

            const refreshToken = await SecureStore.getItemAsync('refresh_token');
            setRefreshToken(refreshToken);

            if (await SecureStore.getItemAsync('currentStep') == null) {
                await SecureStore.setItemAsync('currentStep', '2');
            }

            const currentStep = await SecureStore.getItemAsync('currentStep');
            setStep(currentStep);

            if(currentStep==null || currentStep!='done'){
                router.push('/profiling')
            }
        };
        fetchUserInfo();
    }, []);

    return (
        <View style={{ paddingTop: 200 }}>
            <Text>You are logged in!</Text>
            <TouchableOpacity onPress={() => { handleLogout() }}>
                <Text>Logout</Text>
            </TouchableOpacity>

            <Text></Text>
            <Text>Token</Text>
            <Text>{token ? token : "No token found"}</Text>

            <Text></Text>
            <Text>Refresh token</Text>
            <Text>{refreshToken ? refreshToken : "No refresh token found"}</Text>

            <Text></Text>
            <Text>Current step</Text>
            <Text>{step ? step : "No current step found"}</Text>
        </View>
    );
}