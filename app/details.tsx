import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Entypo from '@expo/vector-icons/Entypo';


const { width } = Dimensions.get('window');
const API_URL = "http://10.0.2.2:4000/api"

export default function DetailsScreen() {
    const { id } = useLocalSearchParams();

    const router = useRouter();
    const { t } = useTranslation();

    let colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const [isAddedInBasket, setIsAddedInBasket] = useState(false);
    const styles = styling(colorScheme, insets, isAddedInBasket)

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [addedQuantity, setAddedQuantity] = useState(0);

    useEffect(() => {
        const getProductinfo = async () => {
            //call api to get product info by id

            //finally{
            //  setLoading(false)
            //}
        }

        getProductinfo()
    }, []);

    const handleAddToBasket = () => {
        setIsAddedInBasket(true)
    }

    const handleMinus = () => {
        if (addedQuantity == 0) return;
        setAddedQuantity(prev => prev - 1)
    }

    const handlePlus = () => {
        setAddedQuantity(prev => prev + 1)

    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.topNavBar}>
                    <TouchableOpacity onPress={() => { router.back() }}>
                        <Image source={require('../assets/images/back.png')} style={styles.back} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>Details</Text>
            </View>

            <ScrollView style={styles.scrollArea}>
                <View>
                    <View style={styles.imageSlider}>
                        <Image
                            style={styles.productImage}
                            source={require("../assets/images/productimage.png")}
                        />
                        <View style={styles.sliderDots}>
                            <View style={[styles.sliderDot, styles.sliderDotActive]}></View>
                            <View style={styles.sliderDot}></View>
                            <View style={styles.sliderDot}></View>
                            <View style={styles.sliderDot}></View>
                        </View>
                    </View>

                    <View style={styles.productInfo}>
                        <Text style={styles.productTitle}>Barilla Pesto Genovese con Aglio - 190 Gr</Text>
                        <Text style={styles.productDescription}>13,63 /kilo - 190 gr</Text>
                    </View>
                </View>

                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab == 0 && styles.tabActive]}
                        onPress={() => { setActiveTab(0) }}
                    >
                        <Text style={[styles.tabText, activeTab == 0 && styles.tabTextActive]}>
                            Product Details
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab == 1 && styles.tabActive]}
                        onPress={() => { setActiveTab(1) }}
                    >
                        <Text style={[styles.tabText, activeTab == 1 && styles.tabTextActive]}>
                            Specifications
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab == 0 && <View style={styles.tabContent}>
                    <Text style={styles.paragraph}>
                        Barilla Pesto Genovese, 190g, is a classic Italian sauce crafted with traditional ingredients like fresh basil, pine nuts, Parmesan cheese, garlic, and high-quality olive oil.
                    </Text>
                </View>}

                {activeTab == 1 && <View style={styles.tabContent}>
                    <Text style={styles.paragraph}>
                        tab2
                    </Text>
                </View>}

            </ScrollView>

            <View style={styles.navbar}>
                {!isAddedInBasket && <View style={{ paddingHorizontal: 20 }}>
                    <TouchableOpacity style={styles.navbarCTA} onPress={() => handleAddToBasket()}>
                        <Text style={styles.navbarCTAText}>Add To Basket</Text>
                    </TouchableOpacity>
                </View>}

                {isAddedInBasket && <View style={styles.quantitySection}>
                    <Text style={{fontFamily:'Avenir',fontSize:20,color:'#fff'}}>Added quantity</Text>
                    <View style={[styles.quantitySection, { flex: 1, gap: 10, padding: 0 }]}>
                        <TouchableOpacity
                            style={[styles.quantityBtn, addedQuantity <= 0 && { opacity: 0.6 }]}
                            onPress={() => handleMinus()}
                            disabled={addedQuantity <= 0}
                        >
                            <Entypo name="minus" size={20} color="#fff" />
                        </TouchableOpacity>

                        <Text style={styles.quantityAdded}>{addedQuantity}</Text>


                        <TouchableOpacity style={styles.quantityBtn} onPress={() => handlePlus()}>
                            <Entypo name="plus" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>}
            </View>
        </GestureHandlerRootView>
    );
}

const styling = (colorScheme: string, insets: any, isAddedInBasket: Boolean) => {

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : isAddedInBasket ? '#155935' : '#fff',
            paddingBottom: insets.bottom,
        },
        title: {
            fontSize: 16,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: 10
        },
        topNavBar: {
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#fff',
            marginBottom: 10,
            position: 'relative',
            zIndex: 1
        },
        back: {
            width: 11,
            height: 20,
            objectFit: 'contain'
        },
        header: {
            paddingBottom: 10,
            paddingTop: insets.top,
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFF',
            // iOS
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            // Android
            elevation: 2,
            zIndex: 1
        },
        scrollArea: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
        },
        tabContent: {
            paddingHorizontal: 32
        },
        paragraph: {
            fontFamily: 'Avenir',
            fontSize: 16,
            lineHeight: 24
        },
        imageSlider: {
            alignItems: 'center',
            marginBottom: 50
        },
        productImage: {
            height: 220,
            aspectRatio: 1,
            objectFit: 'contain',
            marginBottom: 10,
        },
        sliderDots: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5
        },
        sliderDot: {
            width: 8,
            height: 8,
            borderRadius: 8,
            backgroundColor: '#D9D9D9'
        },
        sliderDotActive: {
            width: 20,
            backgroundColor: '#155935'
        },
        productInfo: {
            paddingHorizontal: 30,
            marginBottom: 25
        },
        productTitle: {
            fontFamily: 'Avenir',
            fontSize: 20,
            lineHeight: 25,
            color: '#000000',
            marginBottom: 15,
        },
        productDescription: {
            fontFamily: 'Avenir',
            fontSize: 16,
            lineHeight: 25,
            color: '#707070',
        },
        tabs: {
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center'
        },
        tab: {
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: '#c0c0c0',
            paddingBottom: 10
        },
        tabActive: {
            borderBottomColor: '#155935'
        },
        tabText: {
            fontSize: 16,
            fontFamily: 'Avenir-Bold',
            textTransform: 'uppercase',
            color: '#c0c0c0',
            textAlign: 'center'
        },
        tabTextActive: {
            color: '#155935'
        },
        navbar: {
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#fff',
            position: 'relative',
        },
        navbarCTA: {
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
        navbarCTAText: {
            color: '#fff',
            fontFamily: 'Avenir',
            fontSize: 18,
        },
        navImg: {
            width: 30,
            height: 30,
            objectFit: 'contain',
        },

        quantitySection: {
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            backgroundColor: '#155935',
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom:5
        },
        quantityBtn: {
            borderWidth: 1,
            paddingHorizontal: 20,
            borderRadius: 30,
            borderColor: '#fff',
            height: 35,
            justifyContent: 'center',
            alignItems: 'center'
        },

        quantityAdded: {
            color: '#fff',
            fontSize: 20,
            fontFamily: 'Avenir',
            textAlign: 'center'
        }

    });
};