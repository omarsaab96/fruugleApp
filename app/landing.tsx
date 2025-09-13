import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';


export default function landingScreen() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("refresh_token");
        await SecureStore.deleteItemAsync("userID");
        await SecureStore.deleteItemAsync("email_verified");
        router.replace("/");
    }

    // useEffect(() => {
    //     const fetchToken = async () => {
    //         const storedToken = await SecureStore.getItemAsync('token');
    //         console.log(storedToken)
    //         setToken(storedToken);

    //         const refreshToken = await SecureStore.getItemAsync('refresh_token');
    //         console.log(refreshToken)
    //         setRefreshToken(refreshToken);


    //     };
    //     fetchToken();
    // }, []);

    return (
        <View style={{ paddingTop: 200 }}>
            <Text>You are logged in!</Text>
            <TouchableOpacity onPress={() => { handleLogout() }}>
                <Text>Logout</Text>
            </TouchableOpacity>

            {/* <Text>{token ? token : "No token found"}</Text>
            <Text>{refreshToken ? refreshToken : "No refresh token found"}</Text> */}
        </View>
    );
}