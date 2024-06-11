import React, { FC, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, ImageBackground, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    responsiveFontSize,
    responsiveScreenFontSize,
    responsiveScreenHeight,
    responsiveScreenWidth
} from "react-native-responsive-dimensions";
import { SvgXml } from 'react-native-svg';
import { useNavigation } from "@react-navigation/native";
import { IDefaultProps } from "../../utils/types.ts";
import PremiumSvg from "../../../assets/svgs/Premium.js";
import RobotSvg from "../../../assets/svgs/Robot.js";
import CrossSvg from "../../../assets/svgs/cross.js";
import TickSvg from "../../../assets/svgs/Tick.js";
import AdsSvg from "../../../assets/svgs/NoAds.js";
import BrainSvg from "../../../assets/svgs/Brain.js";
import Card from "../../components/Card/card.tsx";
import ButtonComponent from "../../components/Button/Button.tsx";
import CanelSvg from "../../../assets/svgs/Cancel.js";
import Review from "../../components/ReviewCard/Review.tsx";
import themeColors from "../../theme/colors.ts";
import FONTS from "../../theme/FONTS.tsx";
import backArrow from "../../../assets/svgs/backArrow.js";
import ChatSvg from "../../../assets/svgs/ChatSvg.js";
import useSubscription from "../../hooks/useSubscription.ts";
import Toast from "react-native-simple-toast";
import ExtractPriceAndPeriod from "../../components/price&Periods/GetSubsDetails.tsx";
import { finishTransaction, getSubscriptions, purchaseUpdatedListener, requestSubscription } from "react-native-iap";
import { REVENUE_CAT_ANDROID_APIKEY, REVENUE_CAT_IOS_APIKEY } from "../../utils/app-config.ts";
import getUniqueDeviceId from "../../utils/device-id.ts";

interface HomeProps extends IDefaultProps {
}

const Subscription: FC<HomeProps> = ({ ...props }) => {
    const navigation: any = useNavigation()
    const [allProducts, setAllProducts] = useState<any>()
    const [isLoader, setIsLoader] = useState(false)
    const [subscriptionHook, subscriptionHookAction] = useSubscription()
    const [selected, setSelected] = useState<any>()
    const [description, setDescription] = useState('')
    const iosProductIds = ["weekly.subscription", "monthly.subscription", "yearly.subscription"]; // Replace with your actual product IDs
    const androidProductIds = ["com.aichat"]; // Replace with your actual product IDs
    const [selectedProdToken, setSelectedProdToken] = useState();
    const selectedProdId = useRef(null);  //
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products: any = await getSubscriptions({ skus: Platform.OS === 'ios' ? iosProductIds : androidProductIds });
                if (Platform.OS === 'ios') {
                    const sortedProducts = products.sort((a: any, b: any) => {
                        const order = ['Weekly', 'Monthly', 'Yearly'];
                        return order.indexOf(a.title) - order.indexOf(b.title);
                    });
                    setAllProducts(sortedProducts);

                } else {
                    products[0].subscriptionOfferDetails?.splice(3, 1);
                    setDescription(products[0]?.description)
                    setAllProducts(products[0].subscriptionOfferDetails);
                }
            } catch (err) {
                console.warn(err);
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
                                await finishTransaction({ purchase, isConsumable: false }).then((res)=>{
                                    console.log('first', res)
                                }).catch((error)=>{
                                    console.log('first', error)
                                })
                                await sendPurchaseToRevenueCat(purchase)
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
            } catch (error: any) {
                setIsLoader(false)
                Alert.alert('error', error)
                console.log('Error sending purchase to RevenueCat:', error);
            }
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewStyle}
            bounces={false}
        >
            <ImageBackground
                source={require('../../../assets/images/AIChat.png')}
                style={styles.imageBackground}
                resizeMode="cover"
            >

                <SafeAreaView>
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
                        <Text style={styles.secondtext}>
                            Unlock Unlimited Access!
                        </Text>
                    </View>

                    <View style={styles.thirdmainview}>
                        <View style={styles.thirdview}>
                            <Text style={styles.thirdviewtext}>Features</Text>
                            <View style={styles.thirdsvgview}>
                                <Text style={styles.thirdsvgviewtext}>Free</Text>
                                <View style={styles.thirdviewnested}>
                                    <SvgXml xml={PremiumSvg} width="100%" height="100%" />
                                </View>
                            </View>
                        </View>

                        <View style={styles.fourthviewmain}>
                            <View style={styles.fourthview1}>
                                <View style={styles.fourthview2}>
                                    <SvgXml xml={RobotSvg} width="100%" height="100%" />
                                </View>
                                <Text style={styles.fourthview2text}>Best Model AI</Text>
                            </View>

                            <View style={styles.fourthview3}>
                                <View style={styles.fourthview4}>
                                    <SvgXml xml={CrossSvg} width="100%" height="100%" />
                                </View>
                                <View style={styles.fourthview5}>
                                    <SvgXml xml={TickSvg} width="100%" height="100%" />
                                </View>
                            </View>
                        </View>

                        <View style={styles.fourthviewmain}>
                            <View style={styles.fourthview1}>
                                <View style={styles.fourthview2}>
                                    <SvgXml xml={AdsSvg} width="100%" height="100%" />
                                </View>
                                <Text style={styles.fourthview2text}>No Ads</Text>
                            </View>
                            <View style={styles.fourthview3}>
                                <View style={styles.fourthview4}>
                                    <SvgXml xml={CrossSvg} width="100%" height="100%" />
                                </View>
                                <View style={styles.fourthview5}>
                                    <SvgXml xml={TickSvg} width="100%" height="100%" />
                                </View>
                            </View>
                        </View>

                        <View style={styles.fourthviewmain}>
                            <View style={styles.fourthview1}>
                                <View style={styles.fourthview2}>
                                    <SvgXml xml={ChatSvg} width="100%" height="100%" />
                                </View>
                                <Text style={styles.fourthview2text}>Unlimited Msgs</Text>
                            </View>
                            <View style={styles.fourthview3}>
                                <View style={styles.fourthview4}>
                                    <SvgXml xml={CrossSvg} width="100%" height="100%" />
                                </View>
                                <View style={styles.fourthview5}>
                                    <SvgXml xml={TickSvg} width="100%" height="100%" />
                                </View>
                            </View>
                        </View>

                        <View style={[styles.fourthviewmain, { borderBottomWidth: 0, }]}>
                            <View style={styles.fourthview1}>
                                <View style={styles.fourthview2}>
                                    <SvgXml xml={BrainSvg} width="100%" height="100%" />
                                </View>
                                <Text style={styles.fourthview2text}>Detailed Answers</Text>
                            </View>
                            <View style={styles.fourthview3}>
                                <View style={styles.fourthview4}>
                                    <SvgXml xml={CrossSvg} width="100%" height="100%" />
                                </View>
                                <View style={styles.fourthview5}>
                                    <SvgXml xml={TickSvg} width="100%" height="100%" />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        {allProducts?.length > 0 && allProducts?.map((item: any, index: number) => {
                            let productId = Platform.OS === 'android' ? item?.basePlanId : item?.productId
                            const pricesAndPeriods = ExtractPriceAndPeriod(Platform.OS === 'ios' ? item?.description : description);
                            return (
                                <React.Fragment key={index}>
                                    <Card
                                        text={Platform.OS === 'android' ? pricesAndPeriods[index]?.period.charAt(0).toUpperCase() + pricesAndPeriods[index]?.period.slice(1) + 'ly' : `${pricesAndPeriods?.period.charAt(0).toUpperCase() + pricesAndPeriods?.period.slice(1)}` + 'ly'}
                                        description={Platform.OS === 'android' ? pricesAndPeriods[index]?.price : pricesAndPeriods?.price}
                                        save={productId}
                                        smallDesc={Platform.OS === 'android' ? `/${pricesAndPeriods[index]?.period}` : `/${pricesAndPeriods?.period}`}
                                        isCircleActive={selected === productId}
                                        purchased={subscriptionHook.status === "active" && subscriptionHook?.productIdentifier === productId}
                                        handleCardPress={() => {
                                            let selectedProd = Platform.OS === 'android' ? item?.basePlanId : item?.productId
                                            setSelected(selectedProd)
                                            setSelectedProdToken(item?.offerToken)
                                            selectedProdId.current = selectedProd;  // Explicitly change selectedProdId
                                        }}
                                    />
                                </React.Fragment>
                            )
                        })}
                    </View>

                    <View style={styles.buttonview}>
                        {!isLoader ?
                            <ButtonComponent text="Continue" onPress={() => {
                                if (!selected) {
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
                            :
                            <View>
                                <ActivityIndicator color={themeColors.white} size={'large'} />
                            </View>
                        }

                        <SvgXml xml={CanelSvg} width={responsiveScreenWidth(30)} height={responsiveScreenHeight(5)} />
                    </View>
                    <View style={{ margin: "5%" }}>
                        <Text style={{ color: "white", fontSize: responsiveScreenFontSize(2.5) }}>
                            Some Reviews
                        </Text>
                    </View>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Review
                            name={"Sophia N."}
                            image={require('../../../assets/images/userImg.png')}
                            ratingsNumber={5}
                            review={"Spectacular AI in all the themes I have tried so far."}
                        />
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
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewStyle: {
        flexGrow: 1,
        width: responsiveScreenWidth(100),
        backgroundColor: 'grey',
    },
    container: {
        backgroundColor: 'red',
        overflow: 'hidden'
    },
    imageBackground: {
        width: responsiveScreenWidth(100),
        flexGrow: 1,
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: responsiveScreenWidth(2),
        marginTop: responsiveScreenHeight(3)
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
        marginTop: responsiveScreenHeight(35),
        gap: responsiveFontSize(10),
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
        width: '95%',
        alignSelf: 'center',
        padding: 5,
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
    thirdsvgview: {
        flexDirection: "row",
        width: responsiveScreenWidth(45),
        justifyContent: "space-between",
        alignItems: 'center',
    },
    thirdsvgviewtext: {
        color: "white",
        fontSize: responsiveScreenFontSize(2)
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
        alignItems: "center",
        justifyContent: "center",
        marginTop: responsiveScreenHeight(2),
        gap: responsiveFontSize(0.5),

    },
    buttonview: {
        marginTop: "3%",
        alignItems: "center",
        justifyContent: "center",
    }
});

export default Subscription;
