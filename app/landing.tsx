import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Text, TouchableOpacity, View } from 'react-native';


export default function AppSplash() {
    const router = useRouter();

    const handleLogout = async() =>{
        await SecureStore.deleteItemAsync('loginInfo');
        await SecureStore.deleteItemAsync('token');
        router.replace("/")
    }

    return (
        <View style={{ paddingTop: 200 }}>
            <Text >You are logged in!</Text>
            <TouchableOpacity onPress={()=>{handleLogout()}}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}