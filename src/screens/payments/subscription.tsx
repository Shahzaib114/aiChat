import React, { FC, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, Linking, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    responsiveFontSize,
    responsiveScreenFontSize,
    responsiveScreenHeight,
    responsiveScreenWidth
} from "react-native-responsive-dimensions";
import { SvgXml } from 'react-native-svg';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { IDefaultProps } from "../../utils/types.ts";
import Card from "../../components/Card/card.tsx";
import ButtonComponent from "../../components/Button/Button.tsx";
import Review from "../../components/ReviewCard/Review.tsx";
import themeColors from "../../theme/colors.ts";
import FONTS from "../../theme/FONTS.tsx";
import backArrow from "../../../assets/svgs/backArrow.js";
import useSubscription from "../../hooks/useSubscription.ts";
import Toast from "react-native-simple-toast";
import ExtractPriceAndPeriod from "../../components/price&Periods/GetSubsDetails.tsx";
import { finishTransaction, getAvailablePurchases, getSubscriptions, purchaseUpdatedListener, requestSubscription } from "react-native-iap";
import { REVENUE_CAT_ANDROID_APIKEY, REVENUE_CAT_IOS_APIKEY } from "../../utils/app-config.ts";
import getUniqueDeviceId from "../../utils/device-id.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EvaAiTxtSvg } from "../../../assets/svgs/evaAiTxtSvg.js";
import { LinearGradient } from "react-native-linear-gradient";

interface HomeProps extends IDefaultProps {
}

const Subscription: FC<HomeProps> = ({ ...props }) => {

    const navigation: any = useNavigation()
    const focus = useIsFocused()
    const [allProducts, setAllProducts] = useState<any>()
    const [isLoader, setIsLoader] = useState(false)
    const [restoreLoader, setRestoreLoader] = useState(false)
    const [subsModalCLose, setSubsModalClose] = useState(false)
    const [subscriptionHook, subscriptionHookAction] = useSubscription()
    const [subscriptionDetails, setSubscriptionDetails] = useState<any>()
    const [selected, setSelected] = useState<any>()
    const [isGetPackage, setIsGetPackage] = useState(false)
    const [description, setDescription] = useState('')
    const iosProductIds = ["weekly.subscription", "monthly.subscription", "yearly.subscription"]; // Replace with your actual product IDs
    const androidProductIds = ["com.aichat"]; // Replace with your actual product IDs
    const [selectedProdToken, setSelectedProdToken] = useState();
    const selectedProdId = useRef(null);  //
    const [subsDetails, setsubsDetails] = useState('')
    const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
    const [isSelectedPurchased, setIsSelectedPurchased] = useState(false)

    useEffect(() => {
        async function getAsyncValue() {
            const isFirstTime = await AsyncStorage.getItem('isFirstTime')
            return isFirstTime
        }
        getAsyncValue().then(async (res) => {
            if (res == null) {
                setIsFirstTime(true)
                navigation.getParent()?.setOptions({
                    tabBarStyle: {
                        display: "none",
                        height: 60,
                        backgroundColor: themeColors.black,
                    },
                });
                await AsyncStorage.setItem('isFirstTime', JSON.stringify(true))
                return
            } else {
                navigation.getParent()?.setOptions({
                    tabBarStyle: {
                        height: 60,
                        backgroundColor: themeColors.black,
                        borderTopWidth: 0,
                    },
                });
                return
            }
        })

        // Cleanup to reset the tab bar style when the component unmounts
        return () => navigation.getParent()?.setOptions({
            tabBarStyle: undefined,
        });

    }, [navigation, focus]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products: any = await getSubscriptions({ skus: Platform.OS === 'ios' ? iosProductIds : androidProductIds });
                if (Platform.OS === 'ios') {
                    const sortedSubscriptions = products.sort((a: any, b: any) => {
                        const order: any = {
                            "YEAR": 1,
                            "MONTH": 2,
                            "DAY": 3
                        };

                        return order[a.subscriptionPeriodUnitIOS] - order[b.subscriptionPeriodUnitIOS];
                    });
                    setAllProducts(sortedSubscriptions);
                } else {
                    products[0].subscriptionOfferDetails?.splice(3, 1);
                    let sortedProducts = products[0].subscriptionOfferDetails?.filter((item)=> item?.basePlanId !== 'yearly-discounted-subscription')
                    setDescription(products[0]?.description)
                    setAllProducts(sortedProducts);
                }
                setIsGetPackage(true)
            } catch (err) {
                console.warn(err);
                setIsGetPackage(true)
            }
        };

        fetchProducts();

        const purchaseUpdateSubscription = Platform.OS === 'android' && purchaseUpdatedListener(async (purchase) => {
            try {
                const receipt = purchase.transactionReceipt;
                if (receipt) {
                    await finishTransaction({ purchase, isConsumable: false });
                    await sendPurchaseToRevenueCat(purchase)
                }
            } catch (error) {
                console.error('Purchase error:', error);
            }
        });

        return () => {
            if (purchaseUpdateSubscription) {
                purchaseUpdateSubscription.remove();
            }

        };
    }, []);

    const handlePurchaseIOS = async (myProducts: any) => {
        setIsLoader(true)
        let payment: any = await getSubscriptions({ skus: [myProducts] })
            .then(async (value: any) => {
                return await requestSubscription({
                    sku: myProducts,
                    ...('offerToken' && {
                        subscriptionOffers: [
                            {
                                sku: myProducts, // as a string
                                offerToken: 'offerToken',
                            },
                        ],
                    }),
                })
                    .then(async (purchase: any) => {
                        if (Platform.OS == 'ios') {
                            if (
                                purchase &&
                                purchase?.transactionReceipt
                            ) {
                                await finishTransaction({ purchase, isConsumable: false }).then((res) => {
                                    console.log('first', res)
                                }).catch((error) => {
                                    console.log('first', error)
                                })
                                await sendPurchaseToRevenueCat(purchase)
                            }
                        }
                    })
                    .catch(error => {
                        setSubsModalClose(false)
                        setIsLoader(false)
                        return {
                            error: error,
                            success: false,
                        };
                    });
            })
            .catch(err => {
                setSubsModalClose(false)
                setIsLoader(false)
                return {
                    error: err,
                    success: false,
                };
            });
        return payment;
    }


    const restorePurchases = async () => {
        try {
            setRestoreLoader(true)
            const purchases = await getAvailablePurchases();
            setRestoreLoader(false)
            Alert.alert('Restore Successful', 'Your purchases have been restored.');
            return
            if (purchases && purchases.length > 0) {
                purchases.forEach(purchase => {
                    if (purchase.productId === 'your_product_id') {
                        // Unlock the purchased content for the user
                        // e.g., mark the purchase as active in your app's state or storage
                    }
                });
                Alert.alert('Restore Successful', 'Your purchases have been restored.');
            } else {
                Alert.alert('No Purchases Found', 'No previous purchases were found.');
            }
        } catch (error) {
            setRestoreLoader(false)
            console.log('Error restoring purchases: ', error);
            Alert.alert('Error', 'There was an error restoring purchases. Please try again.');
        }
    };

    const reviewArray = [
        {
            name: "Sophia N.",
            image: require('../../../assets/images/userImg.png'),
            ratingsNumber: 5,
            review: "Spectacular AI in all the themes I have tried so far."
        },
        {
            name: "Maria jr.",
            image: { uri: 'https://randomuser.me/api/portraits/women/90.jpg' },
            ratingsNumber: 5,
            review: "Best Ai Service in Market so far!",
        },
        {
            name: "Jenna",
            image: { uri: 'https://randomuser.me/api/portraits/women/64.jpg' },
            ratingsNumber: 5,
            review: "Best Ai Service in Market so far!",
        },
        {
            name: "Rosy",
            image: { uri: 'https://randomuser.me/api/portraits/women/86.jpg' },
            ratingsNumber: 5,
            review: "Eva AI is the perfect study partner, providing personalized guidance and invaluable insights that have transformed my educational journey!",
        },
        {
            name: "John",
            image: { uri: 'https://randomuser.me/api/portraits/men/79.jpg' },
            ratingsNumber: 5,
            review: "Eva AI has made learning a joy with its user-friendly interface and wealth of educational resources!",
        },
        {
            name: "Christopher",
            image: { uri: 'https://randomuser.me/api/portraits/men/53.jpg' },
            ratingsNumber: 5,
            review: "Eva AI surpasses expectations, offering intuitive access to a vast array of educational materials and insightful recommendations!",
        },
    ]

    const handlePurchaseAndroid = async (offerToken: any) => {
        setIsLoader(true)
        try {
            await requestSubscription({
                sku: "com.aichat",
                ...('offerToken' && {
                    subscriptionOffers: [
                        {
                            sku: "com.aichat", // as a string
                            offerToken: offerToken
                        },
                    ],
                }),
            })
        } catch (error) {
            setSubsModalClose(false)
            setIsLoader(false)
            console.log('Failed to purchase subscription:', error);
        }
    }


    const sendPurchaseToRevenueCat = async (purchase: any) => {
        const { transactionReceipt, transactionId, productId } = purchase;
        let deviceId = await getUniqueDeviceId()
        let updatedReciept;
        if (Platform.OS === 'android' && typeof transactionReceipt === 'string') {
            let parsedValue: any = JSON.parse(transactionReceipt)
            updatedReciept = parsedValue?.purchaseToken
        }


        if (transactionReceipt && transactionId) {
            try {
                const response = await fetch('https://api.revenuecat.com/v1/receipts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Platform.OS === 'android' ? `Bearer ${REVENUE_CAT_ANDROID_APIKEY}` : `Bearer ${REVENUE_CAT_IOS_APIKEY}` // Replace with your actual API key
                    },
                    body: JSON.stringify({
                        app_user_id: deviceId,
                        fetch_token: Platform.OS === 'android' ? updatedReciept : transactionReceipt,
                        product_id: Platform.OS === 'android' ? selectedProdId.current : productId,
                    })
                });

                const data = await response.json();
                const updatedData = {
                    ...data,
                    selectedPackage: selectedProdId.current // or whichever value you need to set
                };
                Toast.show("Subscription successful", Toast.SHORT)
                await subscriptionHookAction.subscribe(updatedData);
                selectedProdId.current = null
                setIsLoader(false)
                setSubsModalClose(false)
            } catch (error: any) {
                setIsLoader(false)
                setSubsModalClose(false)
                Alert.alert('error', error)
                console.log('Error sending purchase to RevenueCat:', error);
            }
        }
    };
    if (!isGetPackage) {
        return (
            <SafeAreaView style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                <ActivityIndicator color={themeColors.black} size={'large'} />
            </SafeAreaView>
        )
    } else {
        return (
            <ScrollView
                contentContainerStyle={styles.scrollViewStyle}
                bounces={false}
            >
                <>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={subsModalCLose}
                        onRequestClose={() => setSubsModalClose(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.titleText}>
                                    {subscriptionDetails?.title}
                                </Text>

                                <Text style={styles.contentText}>
                                    {subsDetails}
                                </Text>



                                <View style={styles.twoRowItemsContainer}>
                                    <TouchableOpacity
                                        onPress={() => setSubsModalClose(false)}
                                        style={[styles.buttonOpacity, { backgroundColor: themeColors.blackLight }]}
                                    >
                                        <Text style={styles.cancelTxtStyles} >
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    {isLoader ?
                                        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                                            <ActivityIndicator size={'large'} color={themeColors.black} />
                                        </View>
                                        :
                                        <TouchableOpacity
                                            onPress={() => {
                                                let selectedProd = Platform.OS === 'android' ? subscriptionDetails?.basePlanId : subscriptionDetails?.productId
                                                if (subscriptionHook.productIdentifier === selectedProd) {
                                                    Toast.show('You already have this subscription activated ', Toast.LONG)
                                                    return
                                                }
                                                setSelectedProdToken(subscriptionDetails?.offerToken)
                                                selectedProdId.current = selectedProd;

                                                if (Platform.OS === 'ios') {
                                                    handlePurchaseIOS(selectedProd)
                                                } else {
                                                    handlePurchaseAndroid(subscriptionDetails?.offerToken)
                                                }
                                            }}
                                            style={[styles.buttonOpacity, { backgroundColor: themeColors.primary }]}
                                        >
                                            <Text style={styles.acceptTxtStyles} >
                                                Ok
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={{ position: 'absolute', top: 0, width: responsiveScreenWidth(100), height: responsiveScreenHeight(68), backgroundColor: "red" }}>
                        <Image
                            source={require('../../../assets/images/AIChat.png')}
                            style={styles.imageBackground}
                        />
                    </View>
                    <SafeAreaView style={{ backgroundColor: themeColors.blackTransparent }}>
                        <View style={styles.top}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.toptouchable}>
                                <SvgXml xml={backArrow} width="10%" height="50%" />
                                <Text style={styles.toptext}>
                                    Subscription
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.secondview}>

                            <SvgXml
                                xml={EvaAiTxtSvg}
                            />
                            <Text style={[styles.secondtext, { fontSize: responsiveScreenFontSize(1.6), }]}>
                                The Best Custom AI Prompts
                            </Text>
                            <LinearGradient colors={['#619AFC', '#3558D5']}
                                style={{
                                    borderRadius: responsiveFontSize(0.8),
                                }}
                            >
                                <TouchableOpacity style={{
                                    justifyContent: 'center',
                                    padding: responsiveFontSize(1.5),
                                    paddingHorizontal: responsiveFontSize(3),
                                    alignItems: 'center'
                                }}>

                                    <Text style={styles.thirdsvgviewtext}>
                                        Unlock The Power of AI
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                        <View style={{
                            backgroundColor: '#0D1110',
                            padding: responsiveScreenHeight(2.5),
                            width: '100%',
                            borderTopLeftRadius: responsiveFontSize(3),
                            borderTopRightRadius: responsiveFontSize(3)
                        }}>

                            <ScrollView horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ justifyContent: 'space-between', gap: 10, }} style={{ flex: 1, width: '100%', }}>
                                {allProducts?.length > 0 && allProducts?.map((item: any, index: number) => {
                                    let productId = Platform.OS === 'android' ? item?.basePlanId : item?.productId
                                    const pricesAndPeriods = ExtractPriceAndPeriod(Platform.OS === 'ios' ? item?.description : description);
                                    return (
                                        <View
                                            style={styles.card}
                                            key={index}
                                        >
                                            <Card
                                                text={Platform.OS === 'android' ? item?.basePlanId : `${item?.title}`}
                                                androidTitle={item?.pricingPhases?.pricingPhaseList[0]}
                                                description={Platform.OS === 'android' ? pricesAndPeriods[index]?.price : pricesAndPeriods?.price}
                                                save={productId}
                                                smallDesc={Platform.OS === 'android' ? `/${pricesAndPeriods[index]?.period}` : `/${pricesAndPeriods?.period}`}
                                                isCircleActive={selected === productId}
                                                purchased={subscriptionHook.status === "active" && subscriptionHook?.productIdentifier === productId}

                                                handleCardPress={() => {
                                                    console.log('subscriptionHook?.productIdentifier', subscriptionHook?.productIdentifier)
                                                    let selectedProd = Platform.OS === 'android' ? item?.basePlanId : item?.productId
                                                    setSelected(selectedProd)
                                                    setSelectedProdToken(item?.offerToken)
                                                    selectedProdId.current = selectedProd;  // Explicitly change selectedProdId
                                                }}
                                                handleCirclePress={() => {
                                                    let selectedProd = Platform.OS === 'android' ? item?.basePlanId : item?.productId
                                                    setSelected(selectedProd)
                                                    setSelectedProdToken(item?.offerToken)
                                                    selectedProdId.current = selectedProd;  // Explicitly change selectedProdId
                                                }}
                                            />
                                        </View>
                                    )
                                })}
                            </ScrollView>


                            <View style={styles.buttonview}>
                                {selected ?
                                    !isLoader ?
                                        <LinearGradient colors={selected === subscriptionHook?.productIdentifier ? ['#5B5B5B', '#454545'] : ['#619AFC', '#3558D5']}
                                            style={{ borderRadius: 12, width: '95%' }}
                                        >
                                            <ButtonComponent
                                                text={selected === subscriptionHook?.productIdentifier ? "Cancel Subscription" : selected.includes('year') ? "TRY 3 DAYS FREE NOW" : "SUBSCRIBE NOW"}
                                                textStyle={{ color: themeColors.white, fontFamily: FONTS.Manrope_ExtraBold }}
                                                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, }}
                                                onPress={() => {
                                                    if (selected === subscriptionHook?.productIdentifier) {
                                                        if (Platform.OS === 'ios') {
                                                            Linking.openURL('https://apps.apple.com/account/subscriptions')
                                                            return
                                                        } else {
                                                            Linking.openURL('https://play.google.com/store/account/subscriptions')
                                                            return
                                                        }
                                                    } else if (!selected) {
                                                        Toast.show('Please select a plan', Toast.LONG)
                                                        return
                                                    }
                                                    else if (subscriptionHook.productIdentifier === selected) {
                                                        Toast.show('You already have this subscription activated ', Toast.LONG)
                                                        return
                                                    }
                                                    if (Platform.OS === 'ios') {
                                                        handlePurchaseIOS(selected)
                                                    } else {
                                                        handlePurchaseAndroid(selectedProdToken)
                                                    }
                                                }} />
                                        </LinearGradient>
                                        :
                                        <View>
                                            <ActivityIndicator color={themeColors.white} size={'large'} />
                                        </View>
                                    :
                                    <></>
                                }
                                <TouchableOpacity
                                    onPress={() => {
                                        Linking.openURL("https://play.google.com/store/account/subscriptions")
                                    }}
                                    hitSlop={10}
                                    style={{
                                        alignSelf: 'center',
                                        marginTop: '8%',
                                        margin: '3%',
                                        flexDirection: 'row',
                                        paddingHorizontal: '2%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: FONTS.Manrope_Medium,
                                            fontSize: responsiveScreenFontSize(1.5),
                                            color: 'grey'
                                        }}
                                    >
                                        * You can cancel at any time.
                                    </Text>
                                </TouchableOpacity>
                                {Platform.OS === 'ios' ?
                                    !restoreLoader ?
                                        <ButtonComponent text="Restore Purchase"
                                            containerStyle={{
                                                backgroundColor: 'transparent',
                                                borderWidth: 0,
                                                padding: 0,
                                                margin: responsiveFontSize(0),
                                            }}
                                            textStyle={{ color: themeColors.malibu }}
                                            onPress={() => {
                                                restorePurchases()
                                            }} />
                                        :
                                        <View>
                                            <ActivityIndicator color={themeColors.white} size={'large'} />
                                        </View>
                                    :
                                    <></>
                                }

                            </View>

                            <View style={{ margin: "5%" }}>
                                <Text style={{ color: "white", fontSize: responsiveScreenFontSize(3.5), fontFamily: FONTS.Manrope_ExtraBold }}>
                                    What People {'\n'}Say About
                                </Text>
                                <Text style={{
                                    color: themeColors.malibu,
                                    fontSize: responsiveScreenFontSize(3.5),
                                    gap: 10,
                                    paddingBottom: 5,
                                    fontFamily: FONTS.Manrope_ExtraBold
                                }}
                                >
                                    EVA
                                </Text>
                            </View>

                            <ScrollView horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ justifyContent: 'space-between', gap: 10, }} style={{ flex: 1, width: '100%', }}>
                                {reviewArray?.length > 0 && reviewArray?.map((item: any, index: number) => {
                                    return (
                                        <View
                                            style={styles.card}
                                            key={index}

                                        >
                                            <Review
                                                containerStyle={{ height: responsiveScreenHeight(15) }}
                                                name={item?.name}
                                                image={item?.image}
                                                ratingsNumber={item?.ratingsNumber}
                                                review={item?.review}
                                            />
                                        </View>
                                    )
                                })}
                            </ScrollView>

                            {/* <View style={{ alignItems: "center", justifyContent: "center" }}>

                                <Review
                                    name={"Maria jr."}
                                    image={{
                                        uri: "https://randomuser.me/api/portraits/women/90.jpg"
                                    }}
                                    ratingsNumber={5}
                                    review={"Best Ai Service in Market so far!"}
                                />
                                <Review
                                    name={"Jenna"}
                                    image={{
                                        uri: "https://randomuser.me/api/portraits/women/64.jpg"
                                    }}
                                    ratingsNumber={5}
                                    review={"Eva AI is the cat's whiskers of AI apps, offering personalized tips and quirky cat facts that have revolutionized my cat-parenting experience!"}
                                />
                                <Review
                                    name={"Rosy"}
                                    image={{
                                        uri: "https://randomuser.me/api/portraits/women/86.jpg"
                                    }}
                                    ratingsNumber={5}
                                    review={"Eva AI is the perfect study partner, providing personalized guidance and invaluable insights that have transformed my educational journey!"}
                                />
                                <Review
                                    name={"John"}
                                    image={{
                                        uri: "https://randomuser.me/api/portraits/men/79.jpg"
                                    }}
                                    ratingsNumber={5}
                                    review={"Eva AI has made learning a joy with its user-friendly interface and wealth of educational resources!"}
                                />
                                <Review
                                    name={"Christopher"}
                                    image={{
                                        uri: "https://randomuser.me/api/portraits/men/53.jpg"
                                    }}
                                    ratingsNumber={5}
                                    review={"Eva AI surpasses expectations, offering intuitive access to a vast array of educational materials and insightful recommendations!"}
                                />
                            </View> */}
                        </View>

                    </SafeAreaView>
                </>
            </ScrollView>
        );
    }


}

const styles = StyleSheet.create({
    scrollViewStyle: {
        flexGrow: 1,
        width: responsiveScreenWidth(100),
        // height: Dimensions.get('window').height,
        backgroundColor: 'black',
    },
    container: {
        backgroundColor: 'red',
        overflow: 'hidden'
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: 'red'
        // flex: 1,
        // alignSelf: 'flex-start'
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: responsiveScreenWidth(2),
        marginTop: responsiveScreenHeight(3),

    },
    toptouchable: {
        height: responsiveScreenHeight(4.3),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },
    toptext: {
        color: "white",
        fontSize: responsiveScreenFontSize(2.5),
        marginLeft: responsiveScreenWidth(3)
    },
    secondview: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: responsiveScreenHeight(20),
        gap: responsiveFontSize(3),
        margin: responsiveFontSize(3),
    },
    secondtext: {
        color: "white",
        fontSize: responsiveScreenFontSize(2.5),
        fontFamily: FONTS.Manrope_Medium
    },
    thirdmainview: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: responsiveScreenHeight(1),
        borderRadius: 15,
        backgroundColor: themeColors.blackLight,
        width: '100%',
        alignSelf: 'center',
        // padding: 5,
    },
    thirdview: {
        width: '100%',
        padding: responsiveFontSize(2),
        borderBottomWidth: 1,
        borderBottomColor: "grey",
        flexDirection: "row",
        justifyContent: "space-between",
        borderStartColor: 'green',
        alignItems: 'center'
    },
    thirdviewtext: {
        color: "white",
        fontSize: responsiveScreenFontSize(2),
        marginLeft: responsiveScreenWidth(1)
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    buttonOpacity: {
        width: '45%',
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: responsiveFontSize(5),
    },
    contentContainer: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: responsiveFontSize(2),
        borderRadius: responsiveFontSize(3),
        backgroundColor: 'white'
    },
    acceptTxtStyles: {
        padding: responsiveFontSize(2),
        borderRadius: responsiveFontSize(5),
        alignSelf: 'center',
        color: themeColors.white,
        fontFamily: FONTS.Manrope_ExtraBold,
        fontSize: responsiveFontSize(2)
    },
    cancelTxtStyles: {
        padding: responsiveFontSize(2),
        alignSelf: 'center',
        color: themeColors.white,
        fontFamily: FONTS.Manrope_ExtraBold,
        fontSize: responsiveFontSize(2)
    },
    twoRowItemsContainer: {
        width: '95%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'flex-start',
        textAlign: 'left',
    },
    contentText: {
        marginVertical: responsiveFontSize(3),
        color: 'black',
        fontFamily: FONTS.Manrope_Regular,
        width: responsiveScreenWidth(95),
        alignSelf: 'center',
    },
    titleText: {
        color: 'black',
        fontSize: responsiveScreenFontSize(4),
        fontFamily: FONTS.Manrope_ExtraBold,
    },
    thirdsvgview: {
        flexDirection: "row",
        width: responsiveScreenWidth(45),
        justifyContent: "space-between",
        alignItems: 'center',
    },
    thirdsvgviewtext: {
        color: "white",
        fontSize: responsiveScreenFontSize(2),
        fontFamily: FONTS.Manrope_SemiBold
    },
    thirdviewnested: {
        width: responsiveScreenWidth(20),
        height: responsiveScreenHeight(4),
        flexDirection: "row",
    },
    fourthviewmain: {
        width: '100%',
        padding: responsiveFontSize(2),
        borderBottomWidth: 1,
        borderBottomColor: "grey",
        backgroundColor: themeColors.blackLight,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 5
    },
    fourthview1: {
        flexDirection: "row",
        alignItems: "center",
    },
    fourthview2: {
        width: responsiveScreenWidth(4),
        height: responsiveScreenHeight(3),
        flexDirection: "row",
    },
    fourthview2text: {
        color: "white",
        fontSize: responsiveScreenFontSize(2),
        marginLeft: responsiveScreenWidth(2),
    },
    fourthview3: {
        flexDirection: "row",
        width: responsiveScreenWidth(45),
        justifyContent: "space-between"
    },
    fourthview4: {
        width: responsiveScreenWidth(4),
        height: responsiveScreenHeight(3),
        flexDirection: "row",
        marginLeft: responsiveScreenWidth(2)
    },
    fourthview5: {
        width: responsiveScreenWidth(4),
        height: responsiveScreenHeight(3),
        marginRight: responsiveScreenWidth(4)
    },
    card: {
        width: responsiveScreenWidth(80),
    },
    buttonview: {
        marginTop: "3%",
        alignItems: "center",
        justifyContent: "center",
    }
});

export default Subscription;
