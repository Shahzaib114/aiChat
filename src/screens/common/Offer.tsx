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
        <ImageBackground
            source={require("../../../assets/images/bg.png")}
            style={{ flex: 1, justifyContent: 'space-between' }}
            resizeMode="cover"
        >
            <SafeAreaView
                style={styles.safeareaview}>
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ justifyContent: 'space-between', flexGrow: 1 }}>
                    <TouchableOpacity
                        style={styles.view2}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <SvgXml xml={CrossWhiteSvg} width="15%" style={{ alignSelf: 'flex-end' }} />
                    </TouchableOpacity>
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

                    <View style={styles.view3}>
                        <OfferTop text={`This is Just for`} off={"You!"} />
                        <OfferCenter heading={"Special Offer"} off={"-50%"} />
                        <View style={styles.view4}>
                            <Point

                                Icon={<SvgImport svg={starYellow} />}
                                color={"white"}
                                text={"Unlimited chat messages"}
                            />
                            <Point
                                Icon={<Rocket style={styles.iconStyle} />}
                                color={"white"}
                                text={"Improved Answers AI"}
                            />
                            <Point
                                Icon={<PartyPopper size={14} style={styles.iconStyle} />}
                                color={"white"}
                                text={
                                    <Text>
                                        No <Text style={{ color: themeColors.red }}>ADS</Text> in the app
                                    </Text>
                                }
                            />
                            <Point
                                Icon={<RobotHead style={styles.iconStyle} />}
                                color={"white"}
                                text={
                                    <Text style={{ color: "white", fontFamily: FONTS.Manrope_Regular }}>
                                        Powered by{" "}
                                        <Text style={{ color: "lightgreen", fontFamily: FONTS.Manrope_Bold }}>ChatGPT
                                            4</Text>
                                    </Text>
                                }
                            />
                        </View>

                        <View style={styles.view5}>
                            <View style={styles.view6}>
                                <Text
                                    style={styles.view6text1}
                                >
                                    Only{" "}
                                    <Text
                                        style={
                                            styles.view6text2
                                        }
                                    >
                                        $34.99
                                    </Text>
                                </Text>
                                <Text
                                    style={
                                        styles.view6text3
                                    }
                                >
                                    17.99 per year
                                </Text>
                                <Text
                                    style={
                                        styles.view6text4
                                    }
                                >
                                    (Less than US$0.05 per day)
                                </Text>
                            </View>

                            <View
                                style={styles.view7}>
                                <Text
                                    style={styles.view7text}>
                                    Automatically renewable. Cancel whenever you want.
                                </Text>
                            </View>
                            {!isLoader ?
                                <TouchableOpacity
                                    style={styles.btnStyle}
                                    onPress={async () => {
                                        setSubsModalClose(true)
                                    }}
                                >
                                    <Text
                                        style={styles.takeOfferTxt}
                                    >
                                        Take this Offer
                                    </Text>
                                </TouchableOpacity>
                                :
                                <View>
                                    <ActivityIndicator color={themeColors.white} size={'large'} />
                                </View>
                            }
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground >
    );
};

export default Offer;

const styles = StyleSheet.create({
    btnStyle: {
        width: '95%',
        alignSelf: 'center',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: responsiveFontSize(1),
        backgroundColor: themeColors.white
    },
    iconStyle: {
        width: '10%'
    },
    takeOfferTxt: {
        color: themeColors.black,
        fontSize: responsiveFontSize(2),
        fontFamily: FONTS.Manrope_Medium,
        margin: responsiveFontSize(2)
    },
    safeareaview: {
        flexGrow: 1,
        width: '100%',
        padding: 10,
    },
    view2: {
        width: "100%",
        justifyContent: "flex-end",
    },
    view3: {
        alignItems: "center",
        gap: 10,
        width: "100%"
    },
    view4: {
        gap: 10,
        width: '70%',
        alignSelf: 'center',
        marginLeft: '9%'
    },
    view5: {
        marginVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: responsiveFontSize(3)
    },
    view6: {
        width: "100%",
        alignItems: "center",
    },
    view6text1: {
        color: "white",
        fontSize: responsiveFontSize(2),
        fontFamily: FONTS.Manrope_ExtraBold
    },
    view6text2: {
        textDecorationLine: "line-through",
        textDecorationStyle: "solid",
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
    cancelTxtStyles: {
        padding: responsiveFontSize(2),
        alignSelf: 'center',
        color: themeColors.white,
        fontFamily: FONTS.Manrope_ExtraBold,
        fontSize: responsiveFontSize(2)
    },
    titleText: {
        color: 'black',
        fontSize: responsiveScreenFontSize(4),
        fontFamily: FONTS.Manrope_ExtraBold,
    },
    acceptTxtStyles: {
        padding: responsiveFontSize(2),
        borderRadius: responsiveFontSize(5),
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
    view6text3: {
        color: "white",
        marginLeft: 10,
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: responsiveFontSize(2.5),
        fontFamily: FONTS.Manrope_ExtraBold
    },
    view6text4: {
        color: "white",
        marginLeft: 10,
        fontSize: responsiveFontSize(1.4),
        fontFamily: FONTS.Manrope_ExtraBold
    },
    view7: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    view7text: {
        color: "white",
        fontSize: responsiveFontSize(1.4),
        fontFamily: FONTS.Manrope_ExtraBold
    }
});
