import {
    ImageBackground, SafeAreaView, StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    Platform,
    Alert,
    Modal
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import OfferTop from "../../../assets/svgs/offerTop";
import OfferCenter from "../../../assets/svgs/OfferCenter";
import Rocket from "../../../assets/svgs/Rocket";
import PartyPopper from "../../../assets/svgs/PartyPopper";
import RobotHead from "../../../assets/svgs/RobotHead";
import FONTS from "../../theme/FONTS";
import themeColors from "../../theme/colors";
import { responsiveFontSize, responsiveScreenFontSize, responsiveScreenWidth } from "react-native-responsive-dimensions";
import { TouchableOpacity } from "react-native";
import Point from "../../components/point/Point";
import useSubscription from "../../hooks/useSubscription.ts";
import { useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import CrossWhiteSvg from "../../../assets/svgs/crossWhite.js";
import SvgImport from "../../utils/import-svg.tsx";
import starYellow from "../../../assets/svgs/starYellow.js";
import Toast from "react-native-simple-toast";
import ExtractPriceAndPeriod from "../../components/price&Periods/GetSubsDetails.tsx";
import { REVENUE_CAT_ANDROID_APIKEY, REVENUE_CAT_IOS_APIKEY } from "../../utils/app-config.ts";
import getUniqueDeviceId from "../../utils/device-id.ts";
import { finishTransaction, getSubscriptions, purchaseUpdatedListener, requestSubscription } from "react-native-iap";
import blackcross from "../../../assets/svgs/blackcross.js";

const Offer = () => {
    const [discountedProduct, setDiscountedProduct] = useState<any>()
    const [isLoader, setIsLoader] = useState(false)
    const [pricingDetails, setPricingDetails] = useState<any>('')
    const [subscriptionHook, subscriptionHookAction] = useSubscription()
    const navigation = useNavigation();
    const iosProductIds = ["yearly.discounted.subscription"]; // Replace with your actual product IDs
    const androidProductIds = ["com.aichat"]; // Replace with your actual product IDs
    const selectedProdId = useRef(null);  //
    const [subsModalCLose, setSubsModalClose] = useState(false)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products: any = await getSubscriptions({ skus: Platform.OS === 'ios' ? iosProductIds : androidProductIds });
                if (Platform.OS === 'android') {
                    const pricesAndPeriods = ExtractPriceAndPeriod(products[0]?.description);
                    setPricingDetails(pricesAndPeriods[3].price)
                    setDiscountedProduct(products[0].subscriptionOfferDetails[3]);
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
                            {`- Only in $17.99 \n- Improved AI performance\n- GPT - 4 access\n- No Ads.\n- Unlimited yearly messages to chat with EVA.\n- More detailed answers.\n- 1 year Access`}
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
                                    Ok
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
                    <View style={styles.offerview2}>
                        <Text style={styles.headerText}>Get this exclusive offer and </Text>
                        <Text style={styles.headerText}>enjoy all access pass!</Text>
                    </View>
                </View>
                <View style={styles.discountContainer}>
                    <Text style={styles.discountText}>50% OFF</Text>
                    <Text style={styles.subText}>Get this exclusive limited offer!</Text>
                </View>

            </ImageBackground>
            <View style={styles.overlay}>

                <View style={styles.priceContainer}>
                    <View style={styles.freeTrialWrapper}>
                        <View style={styles.freeTrialContainer}>
                            <Text style={styles.freeTrial}>3-day free trial</Text>
                        </View>
                    </View>

                    <Text style={styles.price}>YEARLY</Text>
                    <Text style={styles.priceAmount}>US$17.99 / year</Text>

                    <Text style={styles.priceMonthly}>($1.49 / month) -50%</Text>

                </View>

                <TouchableOpacity
                    onPress={async () => {
                        console.log('[reeesed')
                        setSubsModalClose(true)
                    }}
                    style={styles.subscribeButton}>
                    <Text style={styles.subscribeText}>TRY 3 DAYS AND SUBSCRIBE</Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>*US$17.99 billed annually. Cancel anytime.</Text>
            </View>
        </SafeAreaView>
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
        width: '100%',
        height: "30%"
    },
    freeTrialWrapper: {
        position: 'absolute',
        top: -15,
    },
    freeTrialContainer: {
        backgroundColor: '#627BFC',
        borderRadius: 4,
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 25,
    },
    freeTrial: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    discountContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        alignItems: 'center',
    },
    discountText: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 'bold',
    },
    subText: {
        color: '#ccc',
        fontSize: 16,
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
        marginVertical: responsiveFontSize(3),
        color: 'black',
        fontFamily: FONTS.Manrope_Regular,
        width: responsiveScreenWidth(95),
        alignSelf: 'center',
    },

    priceContainer: {
        marginTop: "7%",
        width: "45%",
        padding: 12,
        borderWidth: 5,
        borderRadius: 4,
        alignItems: 'center',
        borderColor: "#385BD8"
    },
    buttonOpacity: {
        width: '45%',
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: responsiveFontSize(5),
    },

    price: {
        color: '#fff',
        fontWeight: 'bold'
    },
    offerview: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: "2%"
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
    cancelTxtStyles: {
        padding: responsiveFontSize(2),
        alignSelf: 'center',
        color: themeColors.white,
        fontFamily: FONTS.Manrope_ExtraBold,
        fontSize: responsiveFontSize(2)
    },

    priceAmount: {
        color: '#fff',
        fontWeight: 'bold',
    },
    priceMonthly: {
        color: '#4A90E2',
    },
    titleText: {
        color: 'black',
        fontSize: responsiveScreenFontSize(4),
        fontFamily: FONTS.Manrope_ExtraBold,
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
        padding: responsiveFontSize(2),
        borderRadius: responsiveFontSize(5),
        alignSelf: 'center',
        color: themeColors.white,
        fontFamily: FONTS.Manrope_ExtraBold,
        fontSize: responsiveFontSize(2)
    },

    subscribeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    twoRowItemsContainer: {
        width: '95%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'flex-start',
        textAlign: 'left',
    },

    footerText: {
        color: '#ccc',
        fontSize: 12,
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
