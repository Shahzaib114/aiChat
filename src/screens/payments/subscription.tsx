import React, {FC, useEffect, useState} from "react";
import {ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {
    responsiveFontSize,
    responsiveScreenFontSize,
    responsiveScreenHeight,
    responsiveScreenWidth
} from "react-native-responsive-dimensions";
import {SvgXml} from 'react-native-svg';
import {useNavigation} from "@react-navigation/native";
import {IDefaultProps} from "../../utils/types.ts";
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
import Purchases from 'react-native-purchases';
import usePlans from "../../hooks/usePlans.ts";
import useSubscription from "../../hooks/useSubscription.ts";
import {PurchasesPackage} from "@revenuecat/purchases-typescript-internal/dist/offerings";
import Toast from "react-native-simple-toast";

interface HomeProps extends IDefaultProps {
}

const Subscription: FC<HomeProps> = ({...props}) => {
    const [allProducts, setAllProducts] = useState<PurchasesPackage[]>()
    const [subscriptionHook, subscriptionHookAction] = useSubscription()
    const [selected, setSelected] = useState<PurchasesPackage>()
    useEffect(() => {
        getInAppProducts()
    }, [])

    const handlePurchase = async (selectedProduct: any) => {
        try {
            if (subscriptionHook.status === "active") {
                Toast.show('You already have an active subscription', Toast.LONG)
                return
            }
            const purchasing = await Purchases.purchasePackage(selectedProduct);
            console.log('purchased', purchasing)
            subscriptionHookAction.subscribe(purchasing);

        } catch (e) {
            console.log('go error in offering', e)
        }
    };

    const getInAppProducts = async () => {
        try {
            const offerings = await Purchases.getOfferings();
            if (offerings.all !== null) {
                // console.log('offeffvvrings', JSON.stringify(offerings.all))
                setAllProducts(offerings.all?.Standard?.availablePackages)
            }
        } catch (e) {
            console.log('go error in offering', e)
        }
    }


    const extractPriceAndPeriod = (description: string) => {
        const regex = /([\d.]+\$),\/(month|week|year)/;
        const match = description.match(regex);
        if (match) {
            const [_, price, period] = match;
            return {price, period};
        }
        return {price: '', period: ''};
    };

    const navigation: any = useNavigation()
    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewStyle}
        >
            <ImageBackground
                source={require('../../../assets/images/AIChat.png')}
                style={styles.imageBackground}
                resizeMode="cover"
            >

                <SafeAreaView style={{height: responsiveScreenHeight(128.9),}}>
                    <View style={styles.top}>
                        <TouchableOpacity style={styles.toptouchable}>
                            <SvgXml xml={backArrow} width="60%" height="60%"/>
                        </TouchableOpacity>
                        <Text style={styles.toptext}>
                            Subscription
                        </Text>
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
                                    <SvgXml xml={PremiumSvg} width="100%" height="100%"/>
                                </View>
                            </View>
                        </View>

                        <View style={styles.fourthviewmain}>
                            <View style={styles.fourthview1}>
                                <View style={styles.fourthview2}>
                                    <SvgXml xml={RobotSvg} width="100%" height="100%"/>
                                </View>
                                <Text style={styles.fourthview2text}>Best Model AI</Text>
                            </View>

                            <View style={styles.fourthview3}>
                                <View style={styles.fourthview4}>
                                    <SvgXml xml={CrossSvg} width="100%" height="100%"/>
                                </View>
                                <View style={styles.fourthview5}>
                                    <SvgXml xml={TickSvg} width="100%" height="100%"/>
                                </View>
                            </View>
                        </View>

                        <View style={styles.fourthviewmain}>
                            <View style={styles.fourthview1}>
                                <View style={styles.fourthview2}>
                                    <SvgXml xml={AdsSvg} width="100%" height="100%"/>
                                </View>
                                <Text style={styles.fourthview2text}>No Ads</Text>
                            </View>
                            <View style={styles.fourthview3}>
                                <View style={styles.fourthview4}>
                                    <SvgXml xml={CrossSvg} width="100%" height="100%"/>
                                </View>
                                <View style={styles.fourthview5}>
                                    <SvgXml xml={TickSvg} width="100%" height="100%"/>
                                </View>
                            </View>
                        </View>

                        <View style={styles.fourthviewmain}>
                            <View style={styles.fourthview1}>
                                <View style={styles.fourthview2}>
                                    <SvgXml xml={ChatSvg} width="100%" height="100%"/>
                                </View>
                                <Text style={styles.fourthview2text}>Unlimited Msgs</Text>
                            </View>
                            <View style={styles.fourthview3}>
                                <View style={styles.fourthview4}>
                                    <SvgXml xml={CrossSvg} width="100%" height="100%"/>
                                </View>
                                <View style={styles.fourthview5}>
                                    <SvgXml xml={TickSvg} width="100%" height="100%"/>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.fourthviewmain, {borderBottomWidth: 0,}]}>
                            <View style={styles.fourthview1}>
                                <View style={styles.fourthview2}>
                                    <SvgXml xml={BrainSvg} width="100%" height="100%"/>
                                </View>
                                <Text style={styles.fourthview2text}>Detailed Answers</Text>
                            </View>
                            <View style={styles.fourthview3}>
                                <View style={styles.fourthview4}>
                                    <SvgXml xml={CrossSvg} width="100%" height="100%"/>
                                </View>
                                <View style={styles.fourthview5}>
                                    <SvgXml xml={TickSvg} width="100%" height="100%"/>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        {allProducts?.map((item: PurchasesPackage, index: number) => {
                            let productId = item.product.defaultOption?.productId
                            const {price, period} = extractPriceAndPeriod(item?.product?.description)
                            return (
                                <React.Fragment key={index}>
                                    <Card
                                        text={item?.product?.title}
                                        description={price}
                                        smallDesc={`/${period}`}
                                        isCircleActive={selected === item}
                                        purchased={subscriptionHook.status === "active" && subscriptionHook.productIdentifier === productId}
                                        handleCardPress={() => {
                                            setSelected(item)
                                        }}
                                    />
                                </React.Fragment>
                            )
                        })}
                    </View>

                    <View style={styles.buttonview}>
                        <ButtonComponent text="Continue" onPress={() => {
                            if (!selected) {
                                Toast.show('Please select a plan', Toast.LONG)
                                return
                            }
                            handlePurchase(selected)
                        }}/>
                        <SvgXml xml={CanelSvg} width={responsiveScreenWidth(30)} height={responsiveScreenHeight(5)}/>
                    </View>
                    <View style={{margin: "5%"}}>
                        <Text style={{color: "white", fontSize: responsiveScreenFontSize(2.5)}}>
                            Some Reviews
                        </Text>
                    </View>
                    <View style={{alignItems: "center", justifyContent: "center"}}>
                        <Review/>
                        <Review/>
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
        height: responsiveScreenHeight(209)
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
        marginLeft: responsiveScreenWidth(5),
        marginTop: responsiveScreenHeight(3)
    },
    toptouchable: {
        width: responsiveScreenWidth(3.8),
        height: responsiveScreenHeight(4.3),
        justifyContent: 'center',
        alignItems: 'center'
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

    },
    thirdviewtext: {
        color: "white",
        fontSize: responsiveScreenFontSize(2),
        marginLeft: responsiveScreenWidth(1)
    },
    thirdsvgview: {
        flexDirection: "row",
        width: responsiveScreenWidth(45),
        justifyContent: "space-between"
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
