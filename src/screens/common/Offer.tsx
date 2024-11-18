import {
    ImageBackground, SafeAreaView, StyleSheet,
    Text,
    View, Platform,
    Alert,
    Modal
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import FONTS from "../../theme/FONTS";
import themeColors from "../../theme/colors";
import { responsiveFontSize, responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import { TouchableOpacity } from "react-native";
import useSubscription from "../../hooks/useSubscription.ts";
import { useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import Toast from "react-native-simple-toast";
import ExtractPriceAndPeriod from "../../components/price&Periods/GetSubsDetails.tsx";
import { REVENUE_CAT_ANDROID_APIKEY, REVENUE_CAT_IOS_APIKEY } from "../../utils/app-config.ts";
import getUniqueDeviceId from "../../utils/device-id.ts";
import { finishTransaction, getSubscriptions, purchaseUpdatedListener, requestSubscription } from "react-native-iap";
import blackcross from "../../../assets/svgs/blackcross.js";
import LinearGradient from "react-native-linear-gradient";

const Offer = () => {
    const [discountedProduct, setDiscountedProduct] = useState<any>()
    const [isLoader, setIsLoader] = useState(false)
    const [pricingDetails, setPricingDetails] = useState<any>('')
    const [subscriptionHook, subscriptionHookAction] = useSubscription()
    const navigation = useNavigation();
    const iosProductIds = ["yearly.discounted.subscription"]; // Replace with your actual product IDs
    const androidProductIds = ["com.aichatbot"]; // com.aichatbot
    const selectedProdId = useRef(null);  //
    const [subsModalCLose, setSubsModalClose] = useState(false)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products: any = await getSubscriptions({ skus: Platform.OS === 'ios' ? iosProductIds : androidProductIds });
                if (Platform.OS === 'android') {
                    const pricesAndPeriods = ExtractPriceAndPeriod(products[0]?.description);
                    setDiscountedProduct(products[0]?.subscriptionOfferDetails[3])
                } else if (Platform.OS === 'ios') {
                    setPricingDetails(products[0].description)
                    setDiscountedProduct(products[0]);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const purchaseUpdateSubscription = Platform.OS === 'android' && purchaseUpdatedListener(async (purchase) => {
            try {
                await finishTransaction({ purchase, isConsumable: false });
                await sendPurchaseToRevenueCat(purchase)
            } catch (error) {
                console.error('Purchase error:', error);
            }
        });
        return () => {
            if (purchaseUpdateSubscription) {
                purchaseUpdateSubscription.remove();
            }
        };
    })

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
                    .then(async (requestSubscriptionIAP: any) => {
                        if (Platform.OS == 'ios') {
                            if (
                                requestSubscriptionIAP &&
                                requestSubscriptionIAP?.transactionReceipt
                            ) {
                                await sendPurchaseToRevenueCat(requestSubscriptionIAP)
                            }
                        }
                    })
                    .catch(error => {
                        setIsLoader(false)
                        return {
                            error: error,
                            success: false,
                        };
                    });
            })
            .catch(err => {
                setIsLoader(false)
                return {
                    error: err,
                    success: false,
                };
            });
        return payment;
    }
    const handlePurchaseAndroid = async (offerToken: any) => {
        setIsLoader(true)
        try {
            await requestSubscription({
                sku: "com.aichatbot",
                ...('offerToken' && {
                    subscriptionOffers: [
                        {
                            sku: "com.aichatbot", // as a string
                            offerToken: offerToken
                        },
                    ],
                }),
            })
        } catch (error) {
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
                        'Authorization': Platform.OS === 'android' ? `Bearer ${REVENUE_CAT_ANDROID_APIKEY}` : `Bearer ${REVENUE_CAT_IOS_APIKEY}`
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
                navigation.goBack()
            } catch (error: any) {
                setIsLoader(false)
                Alert.alert('error', error)
                console.log('Error sending purchase to RevenueCat:', error);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <Modal
                animationType="slide"
                transparent={true}
                visible={subsModalCLose}
                onRequestClose={() => setSubsModalClose(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.titleText}>
                            Yearly Discounted Access
                        </Text>

                        <Text style={styles.contentText}>
                            {`- 3 days free trial \n- You will be charged After 3 free days \n- Only in $17.99 \n- Improved AI performance\n- GPT - 4 access\n- No Ads.\n- Unlimited yearly messages to chat with EVA.\n- More detailed answers.\n- 1 year Access`}
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

                            <TouchableOpacity
                                onPress={async () => {
                                    setSubsModalClose(false)
                                    if (Platform.OS === 'ios') {
                                        selectedProdId.current = discountedProduct?.productId;
                                        handlePurchaseIOS(discountedProduct.productId)
                                    } else {
                                        handlePurchaseAndroid(discountedProduct.offerToken)
                                        selectedProdId.current = discountedProduct?.basePlanId;
                                    }
                                }}
                                style={[styles.buttonOpacity, { backgroundColor: themeColors.primary }]}
                            >
                                <Text style={styles.acceptTxtStyles} >
                                    Purchase
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ImageBackground
                source={require("../../../assets/images/Image2.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={styles.crosstouchable}>
                    <SvgXml xml={blackcross} width="20" height="12" />
                </TouchableOpacity>
                <View style={styles.offerview}>
                    <LinearGradient colors={['#667EFF', '#5572F1', '#3D5FDD', '#3558D5']}
                        style={styles.offerview2}
                    >
                        <Text style={styles.headerText}>Get this exclusive offer and </Text>
                        <Text style={styles.headerText}>enjoy all access pass!</Text>
                    </LinearGradient>
                </View>
                <View style={styles.discountContainer}>
                    <Text style={styles.discountText}>50% OFF</Text>
                    <Text style={styles.subText}>Get this exclusive limited offer!</Text>
                </View>

            </ImageBackground>
            <View style={styles.overlay}>

                <View style={styles.priceContainer}>
                    <View style={styles.freeTrialContainer}>
                        <Text style={styles.freeTrial}>3-day free trial</Text>
                    </View>
                    <View style={{ marginLeft: responsiveScreenWidth(5), gap: responsiveFontSize(0.2), }}>
                        <Text style={styles.price}>YEARLY</Text>
                        <Text style={styles.priceAmount}>US$17.99 / <Text style={{ fontFamily: FONTS.Manrope_Medium }}>year</Text></Text>
                        <Text style={styles.priceMonthly}>($1.49 / month) </Text>
                    </View>
                    <Text style={styles.discountNumberStyle} > -50%</Text>
                </View>

                <LinearGradient colors={['#667EFF', '#3558D5']}
                    style={styles.subscribeButton}
                >
                    <TouchableOpacity
                        onPress={async () => {
                            console.log('[reeesed')
                            setSubsModalClose(true)
                        }}
                    >
                        <Text style={styles.subscribeText}>TRY 3 DAYS AND SUBSCRIBE</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <Text style={styles.footerText}>*$17.99 billed annually. Cancel anytime.</Text>
            </View>
        </SafeAreaView >
    );
};

export default Offer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
    },
    backgroundImage: {
        flex: 1,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: "30%"
    },
    freeTrialWrapper: {
        position: 'absolute',
        top: responsiveScreenHeight(-2),
        backgroundColor: 'green'
    },
    freeTrialContainer: {
        backgroundColor: '#627BFC',
        width: '80%',
        borderRadius: responsiveFontSize(0.5),
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: responsiveFontSize(1),
        paddingHorizontal: responsiveFontSize(2),
        top: responsiveScreenHeight(-2),
        position: 'absolute'
    },
    freeTrial: {
        color: '#fff',
        fontSize: responsiveFontSize(1.5),
        fontWeight: 'bold',
    },
    headerText: {
        color: '#fff',
        fontFamily: FONTS.Manrope_Bold,
        fontSize: responsiveFontSize(2),
        textAlign: 'center',
        letterSpacing:0.3
    },
    discountContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        alignItems: 'center',
    },
    discountText: {
        color: '#fff',
        fontFamily: FONTS.Manrope_ExtraBold,
        fontSize: responsiveFontSize(4)
    },
    subText: {
        color: '#fff',
        fontFamily: FONTS.Manrope_ExtraBold,
        fontSize: responsiveFontSize(1.8)
    },
    offerview2: {
        backgroundColor: "#5572F1",
        width: "80%",
        borderRadius: 6,
        padding: 10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    contentText: {
        marginVertical: responsiveFontSize(2),
        color: 'black',
        fontFamily: FONTS.Manrope_Regular,
        width: '100%',
        alignSelf: 'center',
    },

    priceContainer: {
        width: "43%",
        height: responsiveScreenHeight(12),
        borderWidth: responsiveFontSize(0.7),
        borderRadius: responsiveFontSize(0.7),
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        borderColor: "#385BD8",
        paddingBottom: 10
    },
    buttonOpacity: {
        width: '49%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: responsiveFontSize(1),
        borderRadius: responsiveFontSize(5),
    },
    price: {
        color: '#fff',
        fontFamily: FONTS.Manrope_ExtraBold,
        fontSize: responsiveFontSize(1.5)
    },
    offerview: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: "2%"
    },
    contentContainer: {
        width: '85%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: responsiveFontSize(1),
        borderRadius: responsiveFontSize(3),
        backgroundColor: 'white'
    },
    cancelTxtStyles: {
        color: themeColors.white,
        fontFamily: FONTS.Manrope_Regular,
        fontSize: responsiveFontSize(1.7)
    },

    priceAmount: {
        color: '#627BFC',
        fontFamily: FONTS.Manrope_ExtraBold,
        fontSize: responsiveFontSize(1.8),
        letterSpacing: 0.5
    },
    priceMonthly: {
        color: '#fff',
        fontFamily: FONTS.Manrope_Medium,
        fontSize: responsiveFontSize(1.5)
    },
    discountNumberStyle: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        color: 'white',
        backgroundColor: "#4867E6",
        padding: 2,
        borderTopLeftRadius: responsiveFontSize(0.5),
        fontFamily: FONTS.Manrope_ExtraBold,
        fontSize: responsiveFontSize(1.5)
    },
    titleText: {
        color: 'black',
        fontSize: responsiveScreenFontSize(3),
        fontFamily: FONTS.Manrope_SemiBold,
        textAlign: 'center'
    },

    subscribeButton: {
        backgroundColor: '#4A90E2',
        width: "80%",
        marginTop: "4%",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        borderRadius: 8,
    },
    acceptTxtStyles: {
        color: themeColors.white,
        fontFamily: FONTS.Manrope_Regular,
        fontSize: responsiveFontSize(1.5)
    },

    subscribeText: {
        color: '#fff',
        fontFamily: FONTS.Manrope_ExtraBold,
        fontSize: responsiveFontSize(1.8),
        letterSpacing: 0.3
    },
    twoRowItemsContainer: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'flex-start',
        textAlign: 'left',
    },

    footerText: {
        color: '#A6A6A6',
        fontFamily: FONTS.Manrope_Medium,
        fontSize: responsiveFontSize(1.5),
        marginTop: "2%",
        textAlign: 'center',
    },
    crosstouchable: {
        backgroundColor: "grey",
        width: "8%",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 30,
        alignSelf: "flex-end",
        marginRight: "3%",
        marginTop: "2%"
    }
});
