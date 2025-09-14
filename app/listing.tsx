import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, FlatList, Image, KeyboardAvoidingView, Platform, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductCard from '../components/productCard';

import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';

const { width } = Dimensions.get('window');
const API_URL = "http://10.0.2.2:4000/api"

export default function ListingScreen() {
    const router = useRouter();
    let colorScheme = useColorScheme();
    const styles = styling(colorScheme)
    const { t } = useTranslation();

    const [products, setProducts] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const sortOptions = ["Popular", "Latest", "Price: Low to High", "Price: High to Low"];
    const [sortBy, setSortBy] = useState<string>("Popular");


    const filterRef = useRef<BottomSheet>(null);
    const sortRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["50%", "85%"], []);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const pageLimit = 10;
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(true);
    const [filtering, setFiltering] = useState(true);
    const [sorting, setSorting] = useState(true);
    const [searching, setSearching] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [keyword, setKeyword] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    useEffect(() => {
        refreshProducts()
    }, []);

    const handleScanBarcode = () => {
        console.log("Barcode clicked")
    }

    const handleSearchInput = (text: string) => {
        setKeyword(text);
        setLoading(false)

        if (debounceTimeout) clearTimeout(debounceTimeout);

        const timeout = setTimeout(async () => {
            if (text.trim().length >= 3 || text.trim().length === 0) {
                setLoading(true);
                try {
                    const res = await fetch(`${API_URL}/universityEvents?q=${text}&page=1&limit=${pageLimit}`);

                    if (res.ok) {
                        const data = await res.json();

                        setProducts(data.data);
                        setHasMore(data.hasMore);
                        setPage(data.page + 1);
                        setTotal(data.total);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setFiltering(false);
                    setSorting(false);
                    setLoading(false);
                    handleCloseModalPress();
                }
            }
        }, 500);

        setDebounceTimeout(timeout);
    };

    const getSetFiltersCount = () => {
        let count = 0;

        if (selectedBrands.length > 0) count++;

        return count;
    }

    const getSetSortsCount = () => {
        let count = 0;

        if (sortBy != 'date') count++;

        return count;
    }

    const handleFilters = () => {
        filterRef.current?.snapToIndex(0);
    };

    const handleSort = () => {
        sortRef.current?.snapToIndex(0);
    };

    const handleCloseModalPress = () => {
        filterRef.current?.close();
        sortRef.current?.close();
    };

    const renderProduct = ({ item }: { item: any }) => (
        <ProductCard product={item} />
    )

    const buildQueryParams = (pageNum: number, searchKeyword: string = keyword) => {
        const queryParams = new URLSearchParams();

        if (searchKeyword) queryParams.append("q", searchKeyword);
        if (selectedBrands) queryParams.append("brand", selectedBrands[0]);

        if (sortBy) {
            queryParams.append("sortBy", sortBy);
        }

        queryParams.append("page", String(pageNum));
        queryParams.append("limit", String(pageLimit));
        console.log(queryParams.toString())
        return queryParams.toString();
    };

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            setPage(prevPage => {
                const currentPage = prevPage; // save current page for fetch
                fetch(`${API_URL}/universityEvents?${buildQueryParams(currentPage)}`)
                    .then(res => res.json())
                    .then(data => {
                        setProducts(prev => [...prev, ...data.data]);
                        setHasMore(data.hasMore);
                        setTotal(data.total);
                    })
                    .catch(console.error);
                return prevPage + 1; // increment page
            });
        } finally {
            setLoading(false);
        }
    }, [selectedBrands, sortBy, keyword]);


    const refreshProducts = useCallback(async () => {
        setRefreshing(true);
        setPage(1);
        try {
            //     const token = await SecureStore.getItemAsync('userToken');
            const res = await fetch(`${API_URL}/universityEvents?${buildQueryParams(1)}`);

            if (res.ok) {
                const data = await res.json();
                setProducts(data.data);
                setHasMore(data.hasMore);
                setTotal(data.total);
                setPage(2);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setFiltering(false);
            setSorting(false);
            setRefreshing(false);
            setLoading(false);
            console.log('refreshing set to false')
            handleCloseModalPress();
        }
    }, [page, hasMore, loading, keyword, selectedBrands, sortBy]);


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >


            <View style={[styles.header]}>
                <View style={styles.topNavBar}>
                    <TouchableOpacity onPress={() => { router.back() }}>
                        <Image source={require('../assets/images/back.png')} style={styles.back} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleScanBarcode()}>
                        <Image source={require('../assets/images/barcode.png')} style={styles.barcode} />
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={[styles.searchContainer]}>
                        <TextInput
                            style={[styles.input, Platform.OS === 'ios' && { padding: 15 }]}
                            placeholder="Search for a product..."
                            placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#707070'}
                            value={keyword}
                            onChangeText={handleSearchInput}
                            selectionColor="#155935"
                        />
                        {searching &&
                            <ActivityIndicator
                                size="small"
                                color="#155935"
                                style={styles.searchLoader}
                            />
                        }
                        <Feather name="search" size={20} color={colorScheme === 'dark' ? '#FFF' : '#707070'} style={styles.searchIcon} />
                    </View>

                    <View style={[styles.filterBar, { gap: 20 }]}>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 50 }]}>
                            <TouchableOpacity style={styles.filterCTA} onPress={() => handleFilters()}>
                                <Octicons name="filter" size={22} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                                <Text style={styles.filterCTAText}>
                                    Brand
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.filterCTA} onPress={() => handleSort()}>
                                <FontAwesome6 name="arrow-right-arrow-left" size={18} color={colorScheme === 'dark' ? '#fff' : '#000'} style={{ transform: [{ rotateZ: "90deg" }] }} />
                                <Text style={styles.filterCTAText}>
                                    {sortBy}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <FlatList
                style={styles.scrollArea}
                data={products}
                renderItem={renderProduct}
                keyExtractor={item => item._id}
                numColumns={2}
                columnWrapperStyle={{ gap: 15, paddingHorizontal: 20, paddingTop: 15 }}
                ListEmptyComponent={() => (
                    <Text style={[styles.empty, { fontFamily: 'Avenir' }]}>
                        No products to show
                    </Text>
                )}
                onEndReached={() => { if (hasMore && !loading && !refreshing) loadProducts(); }}
                onEndReachedThreshold={0.5}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshProducts} colors={['#155935']} tintColor="#2563EB" />}
                ListFooterComponent={
                    <View style={styles.loadingFooter}>
                        {hasMore && (loading || refreshing) && <ActivityIndicator size="large" color="#155935" />}
                    </View>
                }
            />
            <View style={styles.navbar}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <TouchableOpacity style={styles.navbarCTA} onPress={() => router.push('/')}>
                        <Image source={require('../assets/images/msgPageIcon.png')} style={styles.navImg} />
                        {/* <Image source={require('../assets/images/tooltip.png')} style={styles.tooltip} /> */}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navbarCTA} onPress={() => router.push('/listing')}>
                        <Image source={require('../assets/images/browsePageIcon.png')} style={styles.navImg} />
                        {/* <Image source={require('../assets/images/tooltip.png')} style={styles.tooltip} /> */}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navbarCTA} onPress={() => router.push('/')}>
                        <Image source={require('../assets/images/cartPageIcon.png')} style={styles.navImg} />
                        {/* <Image source={require('../assets/images/tooltip.png')} style={styles.tooltip} /> */}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navbarCTA} onPress={() => router.push('/')}>
                        <Image source={require('../assets/images/profilePageIcon.png')} style={styles.navImg} />
                        {/* <Image source={require('../assets/images/tooltip.png')} style={styles.tooltip} /> */}
                    </TouchableOpacity>
                </View>

                {/* <View style={styles.tutorial}>
                    <Text></Text>
                </View> */}
            </View>


        </KeyboardAvoidingView >
    );
}

const styling = (colorScheme: string) => {
    const insets = useSafeAreaInsets();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#fff',
            paddingBottom: insets.bottom,
        },
        topNavBar: {
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#fff',
            marginBottom: 10
        },
        back: {
            width: 11,
            height: 20,
            objectFit: 'contain'
        },
        barcode: {
            width: 30,
            height: 40,
            objectFit: 'contain'
        },
        searchContainer: {
            paddingHorizontal: 20,
            marginBottom: 20,
            position: 'relative'
        },
        input: {
            fontSize: 14,
            paddingLeft: 20,
            paddingRight: 50,
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
            color: colorScheme === 'dark' ? '#fff' : '#black',
            borderRadius: 60,
            fontFamily: 'Avenir',
            // iOS
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 5,
            // Android
            elevation: 4,
        },
        searchLoader: {
            position: 'absolute',
            top: 15,
            right: 30,
        },
        // ====================
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
        },
        searchIcon: {
            position: 'absolute',
            top: 10,
            right: 50,
            width: 20,
            height: 20
        },

        filterBar: {
            paddingHorizontal: 40,
        },
        filterCTA: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
        },
        filterCTAText: {
            color: colorScheme === 'dark' ? '#fff' : '#707070',
            fontFamily: 'Avenir',
            fontSize: 16
        },

        loadingFooter: {
            paddingVertical: 20,
            marginBottom: 50
        },
        empty: {
            color: colorScheme === 'dark' ? '#fff' : '#000',
            fontFamily: 'Avenir',
            padding: 20
        },
        scrollArea: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? '#121212' : 'transparent',
        },
        navbar: {
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#fff',
            position: 'relative'
        },
        tutorial: {
            position:'absolute',
            backgroundColor: '#155935',
            borderRadius: 12,
            padding: 12,
            width: width - 20,
            bottom:65,
            left:10
        },
        navbarCTA: {
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row',
            paddingTop: 12,
            paddingBottom: 15,
            position: 'relative'
        },
        navImg: {
            width: 30,
            height: 30,
            objectFit: 'contain',
        },
        tooltip: {
            position: 'absolute',
            top: -15,
            left: 30,
            width: 25,
            height: 25,
            objectFit: 'contain',
        }
    });
};