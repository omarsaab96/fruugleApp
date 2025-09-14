import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function productCard({ product }) {
    let colorScheme = useColorScheme();
    const styles = styling(colorScheme);

    const handleLike = (productid: string) => {
        console.log('Product ' + productid + ' liked')
    }

    const handleProductClick = (productid: string) => {
        console.log('Product ' + productid + ' liked')
    }

    const handleAddProduct = (productid: string) => {
        console.log('Product ' + productid + ' liked')
    }

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <TouchableOpacity style={styles.like} onPress={() => { handleLike(product._id) }}>
                    <Feather name="heart" size={24} color={colorScheme === 'dark' ? '#DEDEDE' : '#000'} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { handleProductClick(product._id) }}>
                    <View style={styles.cardContent}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={require('../assets/images/productimage.png')} />
                        </View>
                        <Text style={styles.title}>Barilla Pesto Genovese con Aglio - 190 gr</Text>
                        <Text style={styles.description}>13,63 /kilo - 190 gr</Text>
                        <Text style={styles.price}>2,69 € - 2,79 €</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.cardFooter}>
                    <TouchableOpacity onPress={()=>{handleAddProduct(product._id)}} style={styles.cardCTA}>
                        <Text style={styles.cardCTAText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styling = (colorScheme: string) =>
    StyleSheet.create({
        card: {
            width: (width - 55) / 2,
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#fff',
            borderRadius: 12,
            // iOS
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            // Android
            elevation: 2,
        },
        content: {
            flex: 1,
            position: 'relative'
        },
        like: {
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
        },
        cardContent: {
            paddingTop: 16,
            paddingHorizontal: 12,
        },
        category: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#2563EB' : '#7d7f81',
        },
        imageContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 15,
        },
        image: {
            height: 95,
            objectFit: 'contain',
        },
        title: {
            fontFamily: 'Avenir',
            fontSize: 13,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            marginBottom: 4,
            lineHeight: 15
        },
        description: {
            color: colorScheme === 'dark' ? '#A6A6A6' : "#707070",
            marginBottom: 15,
            fontFamily: 'Avenir',
            fontSize: 13
        },
        price: {
            color: colorScheme === 'dark' ? '#9BDEB2' : "#155935",
            fontFamily: 'Avenir',
            fontSize: 20
        },

        cardFooter: {
            paddingHorizontal: 12,
            paddingTop: 15,
            paddingBottom: 10
        },

        cardCTA: {
            backgroundColor: '#155935',
            borderRadius: 20,
            paddingVertical: 3,
            paddingHorizontal: 10,
        },
        cardCTAText: {
            color: '#fff',
            fontFamily: 'Avenir',
            fontSize: 16,
            textAlign: 'center'
        }
    });