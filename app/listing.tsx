import BottomSheet, { BottomSheetBackdrop, BottomSheetFooter, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, FlatList, Image, KeyboardAvoidingView, Platform, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductCard from '../components/productCard';

import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';

const { width } = Dimensions.get('window');
const API_URL = "http://10.0.2.2:4000/api"

export default function ListingScreen() {
    const router = useRouter();
    let colorScheme = useColorScheme();
    const styles = styling(colorScheme)
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();


    const [products, setProducts] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const categories = {
        "Fruits": ["Local", "Imported", "Tropical"],
        "Pasta": ["Spaghetti", "Penne", "Fusilli"],
        "Drinks": ["Soda", "Juice", "Water", "Tea", "Coffee"],
        "Snacks": ["Chips", "Nuts", "Chocolate", "Cookies"],
        "Dairy": ["Milk", "Cheese", "Yogurt", "Butter"],
        "Meat": ["Beef", "Chicken", "Lamb", "Fish"],
        "Bakery": ["Bread", "Croissant", "Muffin", "Cake"]
    };
    const sortOptions = ["Popular", "Latest", "Price: Low to High", "Price: High to Low"];
    const brands = ["Barilla", "Conad", "Buitoni", "Filippo Berio", "Classico", "Alessi"];
    const [sortBy, setSortBy] = useState<string>("Popular");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
    const [tutorialStep, setTutorialStep] = useState(0);

    const categoriesRef = useRef<BottomSheet>(null);
    const filterRef = useRef<BottomSheet>(null);
    const sortRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["50%", "85%"], []);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const pageLimit = 10;
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(true);
    const [categorizing, setCategorizing] = useState(true);
    const [filtering, setFiltering] = useState(true);
    const [sorting, setSorting] = useState(true);
    const [searching, setSearching] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [keyword, setKeyword] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    useEffect(() => {
        const initTutorial = async () => {
            const currentTutorialStep = await SecureStore.getItemAsync("tutorialStep");
            if (!currentTutorialStep) {
                await SecureStore.setItemAsync("tutorialStep", "0");
            } else {
                setTutorialStep(parseInt(currentTutorialStep))
            }
        }

        refreshProducts()
        initTutorial()
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

    const handleCategories = () => {
        categoriesRef.current?.snapToIndex(0);
    };

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
        if (selectedBrands) queryParams.append("brand", selectedBrands.join(","));

        if (sortBy) {
            queryParams.append("sortBy", sortBy.replace(":", "").replaceAll(" ", ""));
        }

        if (selectedCategory) {
            queryParams.append("category", selectedCategory);
        }

        if (selectedSubCategory) {
            queryParams.append("subcategory", selectedSubCategory);
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
    }, [selectedBrands, sortBy, selectedCategory, selectedSubCategory, keyword]);

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
            setCategorizing(false)
            setRefreshing(false);
            setLoading(false);
            handleCloseModalPress();
        }
    }, [page, hasMore, loading, keyword, selectedBrands, sortBy, selectedCategory, selectedSubCategory]);

    const handleSkipTutorial = async () => {
        setTutorialStep(999)
        await SecureStore.setItemAsync('tutorialStep', "999")
    }

    const handleNextTutorialStep = async () => {
        if (tutorialStep == 4) {
            handleSkipTutorial()
            return;
        }
        await SecureStore.setItemAsync('tutorialStep', "" + tutorialStep + 1)
        setTutorialStep(prev => prev + 1)
    }

    const applyCategory = async () => {
        setCategorizing(true)
        setPage(1);
        await refreshProducts();
        categoriesRef.current?.close();
    };

    const applyFilters = async () => {
        setFiltering(true)
        setPage(1);
        await refreshProducts();
        filterRef.current?.close();
    };

    const applySorting = async () => {
        setSorting(true)
        setPage(1);
        await refreshProducts();
        // sortRef.current?.close();
    };

    const renderCategoryFooter = useCallback(
        props => (
            <BottomSheetFooter {...props} style={{ backgroundColor: '#fff', paddingBottom: insets.bottom }}>
                <View style={{ paddingHorizontal: 15 }}>
                    <TouchableOpacity
                        onPress={applyCategory}
                        style={styles.modalButton}
                        disabled={categorizing}
                    >
                        <Text style={styles.modalButtonText}>Search by category</Text>
                        {categorizing && <ActivityIndicator size="small" color="#fff" />}
                    </TouchableOpacity>
                </View>
            </BottomSheetFooter>
        ),
        [categorizing, selectedCategory, selectedSubCategory]
    );

    const renderFilterFooter = useCallback(
        props => (
            <BottomSheetFooter {...props} style={{ backgroundColor: '#fff', paddingBottom: insets.bottom }}>
                <View style={{ paddingHorizontal: 15 }}>
                    <TouchableOpacity
                        onPress={applyFilters}
                        style={styles.modalButton}
                        disabled={filtering}
                    >
                        <Text style={styles.modalButtonText}>Apply Brand</Text>
                        {filtering && <ActivityIndicator size="small" color="#fff" />}
                    </TouchableOpacity>
                </View>
            </BottomSheetFooter>
        ),
        [filtering, selectedBrands]
    );

    const renderSortingFooter = useCallback(
        props => (
            <BottomSheetFooter {...props} style={{ backgroundColor: '#fff', paddingBottom: insets.bottom }}>
                <View style={{ paddingHorizontal: 15 }}>
                    <TouchableOpacity
                        onPress={applySorting}
                        style={styles.modalButton}
                        disabled={sorting}
                    >
                        <Text style={styles.modalButtonText}>Sort</Text>
                        {sorting && <ActivityIndicator size="small" color="#fff" />}
                    </TouchableOpacity>
                </View>
            </BottomSheetFooter>
        ),
        [sorting, sortBy]
    );

    return (
        <GestureHandlerRootView>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={[styles.header, tutorialStep == 4 && { zIndex: 1 }]}>
                    <View style={styles.topNavBar}>
                        <TouchableOpacity onPress={() => { router.back() }}>
                            <Image source={require('../assets/images/back.png')} style={styles.back} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.barcodeCTA} onPress={() => handleScanBarcode()}>
                            <Image source={require('../assets/images/barcode.png')} style={styles.barcode} />
                            {tutorialStep >= 4 && tutorialStep < 999 && <Image source={require('../assets/images/tooltip_inverse.png')} style={[styles.tooltip, styles.barcodeTooltip]} />}
                        </TouchableOpacity>

                        {tutorialStep >= 4 && tutorialStep < 999 && <View style={[styles.tutorial, styles.topTutorial]}>
                            <Text style={styles.tutorialText}>
                                The screen where you can scan any barcode or receipt and add it in your cart
                            </Text>

                            <View style={styles.tutorialActions}>
                                <TouchableOpacity onPress={() => { handleSkipTutorial() }}>
                                    <Text style={styles.tutorialCTAText}>Skip</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.tutorialCTA} onPress={() => { handleNextTutorialStep() }}>
                                    <Text style={styles.tutorialCTAPrimaryText}>Finish</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}
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

                        <View style={styles.filterBar}>
                            <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 25 }]}>
                                <TouchableOpacity style={styles.filterCTA} onPress={() => handleCategories()}>
                                    <MaterialIcons name="category" size={22} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                                    <Text style={styles.filterCTAText}>
                                        Category
                                    </Text>
                                </TouchableOpacity>

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
                            {tutorialStep == 0 && <Image source={require('../assets/images/tooltip.png')} style={styles.tooltip} />}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.navbarCTA} onPress={() => router.push('/listing')}>
                            <Image source={require('../assets/images/browsePageIcon.png')} style={styles.navImg} />
                            {tutorialStep == 1 && <Image source={require('../assets/images/tooltip.png')} style={styles.tooltip} />}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.navbarCTA} onPress={() => router.push('/')}>
                            <Image source={require('../assets/images/cartPageIcon.png')} style={styles.navImg} />
                            {tutorialStep == 2 && <Image source={require('../assets/images/tooltip.png')} style={styles.tooltip} />}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.navbarCTA} onPress={() => router.push('/')}>
                            <Image source={require('../assets/images/profilePageIcon.png')} style={styles.navImg} />
                            {tutorialStep == 3 && <Image source={require('../assets/images/tooltip.png')} style={styles.tooltip} />}
                        </TouchableOpacity>
                    </View>

                    {tutorialStep < 4 && <View style={styles.tutorial}>
                        {tutorialStep == 0 && <Text style={styles.tutorialText}>
                            The screen where you can chat with me
                        </Text>}
                        {tutorialStep == 1 && <Text style={styles.tutorialText}>
                            Shopping page where you can search manually for products
                        </Text>}
                        {tutorialStep == 2 && <Text style={styles.tutorialText}>
                            The standard cart where you can also see product recommendations
                        </Text>}
                        {tutorialStep == 3 && <Text style={styles.tutorialText}>
                            Profile with all your settings
                        </Text>}

                        <View style={styles.tutorialActions}>
                            <TouchableOpacity onPress={() => { handleSkipTutorial() }}>
                                <Text style={styles.tutorialCTAText}>Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.tutorialCTA} onPress={() => { handleNextTutorialStep() }}>
                                <Text style={styles.tutorialCTAPrimaryText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}
                </View>

                <BottomSheet
                    ref={categoriesRef}
                    index={-1}
                    snapPoints={snapPoints}
                    footerComponent={renderCategoryFooter}
                    enableDynamicSizing={false}
                    enablePanDownToClose={true}
                    backgroundStyle={styles.modal}
                    handleIndicatorStyle={styles.modalHandle}
                    backdropComponent={props => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
                    keyboardBehavior="interactive"
                    keyboardBlurBehavior="restore"
                >
                    <View style={{}}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Category</Text>
                        </View>
                    </View>

                    <BottomSheetScrollView contentContainerStyle={[styles.modalScrollView, { paddingHorizontal: 0 }]}>
                        {Object.entries(categories).map(([category, subCategories]) => {
                            const isSelectedCategory = selectedCategory === category && !selectedSubCategory;

                            return (
                                <View key={category}>
                                    {/* Category */}
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedCategory(category);
                                            setSelectedSubCategory("");
                                        }}
                                        style={[
                                            styles.categoryListItem,
                                            isSelectedCategory && { backgroundColor: "#0d4527" },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryListItemText,
                                                isSelectedCategory && { color: "#fff" },
                                            ]}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Subcategories */}
                                    {subCategories.length > 0 &&
                                        subCategories.map((sub, index) => {
                                            const isSelectedSub =
                                                selectedCategory === category && selectedSubCategory === sub;
                                            const isLast = index == subCategories.length - 1

                                            return (
                                                <TouchableOpacity
                                                    key={sub}
                                                    onPress={() => {
                                                        setSelectedCategory(category);
                                                        setSelectedSubCategory(sub);
                                                    }}
                                                    style={[
                                                        styles.subCategoryListItem,
                                                        isLast && { marginBottom: 20 },
                                                        isSelectedSub && { backgroundColor: "#0d4527" },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.subCategoryListItemText,
                                                            isSelectedSub && { color: "#fff" },
                                                        ]}
                                                    >
                                                        {sub}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                </View>
                            );
                        })}
                    </BottomSheetScrollView>

                </BottomSheet>

                
            </KeyboardAvoidingView >
        </GestureHandlerRootView>
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
            marginBottom: 10,
            position: 'relative',
            zIndex: 1
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
        barcodeCTA: {
            position: 'relative',
            zIndex: 1
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
            paddingHorizontal: 20,
        },
        filterCTA: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
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
            position: 'absolute',
            backgroundColor: '#155935',
            borderRadius: 12,
            padding: 12,
            width: width - 20,
            bottom: 65,
            left: 10
        },
        topTutorial: {
            bottom: 'auto',
            top: 55,
        },
        tutorialActions: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 15
        },
        tutorialText: {
            fontSize: 16,
            color: '#fff',
            lineHeight: 21,
            fontFamily: 'Avenir',
            marginBottom: 10
        },
        tutorialCTA: {
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderRadius: 30,
            backgroundColor: '#fff',
        },
        tutorialCTAText: {
            fontSize: 14,
            color: '#fff',
            lineHeight: 25,
            fontFamily: 'Avenir',
        },
        tutorialCTAPrimaryText: {
            fontSize: 14,
            color: '#155935',
            lineHeight: 25,
            fontFamily: 'Avenir',
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
        },
        barcodeTooltip: {
            bottom: -20,
            top: 'auto',
            left: 0,
        },
        modal: {
            backgroundColor: colorScheme === 'dark' ? '#111827' : '#f4f3e9',
        },
        modalHandle: {
            width: 70,
            backgroundColor: colorScheme === 'dark' ? '#2c3854' : '#D9D9D9',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingBottom: 15,
            // borderBottomWidth: 1,
            borderColor: colorScheme === 'dark' ? '#1a253d' : '#e4e4e4',
            color: colorScheme === 'dark' ? '#fff' : '#eee',
        },
        modalTitle: {
            fontSize: 16,
            fontFamily: 'Avenir',
            color: colorScheme === 'dark' ? '#fff' : '#000',

        },
        modalClose: {
            padding: 5,
            borderWidth: 1,
            borderRadius: 20,
            borderColor: colorScheme === 'dark' ? '#2c3854' : '#000',
        },
        modalScrollView: {
            paddingHorizontal: 15,
            paddingBottom: 130
            // marginTop: 50,
            // borderWidth: 1
        },
        filterListItem: {
            marginBottom: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        filterListItemText: {
            fontFamily: 'Avenir',
            fontSize: 16,
            color: '#000'
        },
        categoryListItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        categoryListItemText: {
            fontFamily: 'Avenir',
            fontSize: 16,
            color: '#000'
        },
        subCategoryListItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 40,
            paddingVertical: 5
        },
        subCategoryListItemText: {
            fontFamily: 'Avenir',
            fontSize: 16,
            color: '#000',
            opacity:0.6
        },
        sortingListItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 10
        },
        sortingListItemText: {
            fontFamily: 'Avenir',
            fontSize: 16,
            color: '#000'
        },
        radio: {
            width: 22,
            height: 22,
            borderWidth: 1,
            borderColor: '#707070',
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center'
        },
        radioImg: {
            width: 12,
            height: 12,
            objectFit: 'contain'
        },
        modalButton: {
            backgroundColor: '#155935',
            paddingVertical: 15,
            borderRadius: 30,
            alignItems: 'center',
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 15
        },
        modalButtonText: {
            fontFamily: 'Avenir',
            fontSize: 16,
            color: '#fff'
        },
    });
};