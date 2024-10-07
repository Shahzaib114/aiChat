import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Linking, Platform } from 'react-native';
import {
    responsiveFontSize,
    responsiveScreenFontSize,
    responsiveScreenHeight,
    responsiveScreenWidth
} from 'react-native-responsive-dimensions';
import FONTS from '../../theme/FONTS';
import themeColors from '../../theme/colors';
import { SvgXml } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { BlueCheckSvg } from '../../../assets/svgs/blueCheckSvg.js';

const CustomCard = ({ description, androidTitle, text, smallDesc, save, isCircleActive, purchased, handleCardPress, handleCirclePress }: any) => {
    const getAndroidAndIosTitles = (txt:any) => {
        if (txt?.toLowerCase().includes('week')) {
            return 'WEEKLY \nPLAN'
        } else if (txt?.toLowerCase().includes('month')) {
            return 'Monthly \nPLAN'
        } else if (txt?.toLowerCase().includes('year')) {
            return 'YEARLY \nPLAN'
        }else {
            return;
        }
    }
    return (
        <TouchableOpacity
            onPress={() => {
                handleCardPress()
            }}
            style={[styles.card, {
                alignItems: 'flex-start',
                flexDirection: "column",
                backgroundColor: '#1D1D1D',
                width: '100%',
                height: responsiveScreenHeight(43),
                borderWidth: isCircleActive ? 5 : 0,
                borderColor: isCircleActive ? '#619AFC' : undefined,

            }]}
        >

            <View
                style={{
                    justifyContent: 'space-between',
                    width: '100%',
                    flexDirection: 'row',
                }}
            >

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {purchased ?
                        <LinearGradient colors={['#619AFC', '#3558D5']} style={styles.saveView}>
                            <Text style={styles.saveTxt}>
                                Subscribed
                            </Text>
                        </LinearGradient>
                        :
                        save?.includes('yearly') &&
                        <LinearGradient colors={['#619AFC', '#3558D5']} style={styles.saveView}>
                            <Text style={styles.saveTxt}>
                                3-day free trial
                            </Text>
                        </LinearGradient>
                    }
                    <Text style={[styles.headerText, {}]}>{getAndroidAndIosTitles(text)}</Text>
                </View>
                <View style={{ alignSelf: 'flex-start', justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                    {save?.toLowerCase().includes('year') &&
                        <LinearGradient colors={['#639BFC', '#4E8EFD']} style={styles.offPercentView}>
                            <Text style={styles.saveTxt}>
                                80% off
                            </Text>
                        </LinearGradient>
                    }
                    <Text style={[styles.description, {}]}>
                        {save?.toLowerCase().includes('week') ?
                            Platform.OS === 'android' ? androidTitle?.formattedPrice + androidTitle?.priceCurrencyCode : 'US$14.99'
                            :
                            save?.toLowerCase().includes('month') ?
                                Platform.OS === 'android' ? androidTitle?.formattedPrice + androidTitle?.priceCurrencyCode : 'US$9.19'
                                :
                                save?.toLowerCase().includes('year') &&
                                    Platform.OS === 'android' ? androidTitle?.formattedPrice + androidTitle?.priceCurrencyCode : 'US$34.99'
                        }
                        <Text style={[styles.smallDescription, {}]}>
                            {save?.toLowerCase().includes('week') ?
                                '\n/weekly'
                                :
                                save?.toLowerCase().includes('month') ?
                                    '\n/monthly'
                                    :
                                    save?.toLowerCase().includes('year') &&
                                    '  /yearly'
                            }
                        </Text>
                    </Text>
                    {save?.includes('yearly') &&
                        <View style={{ alignSelf: 'flex-end' }}>
                            <Text style={[styles.smallDescription, {
                                fontFamily: FONTS.Manrope,
                                fontSize: responsiveFontSize(2),
                                textDecorationLine: 'line-through',
                                color: themeColors.osloGray
                            }]}>
                                US$139.49
                            </Text>
                        </View>
                    }
                </View>

            </View>

            <View
                style={{
                    width: '100%',
                    flexDirection: 'column',
                    gap: 10,
                }}
            >
                <View style={[styles.feature, { borderTopWidth: 1, paddingTop: responsiveFontSize(2) }]}>
                    <SvgXml
                        xml={BlueCheckSvg}
                    />
                    <Text style={[styles.featureText]}>
                        Model Chat-GPT 4.40 Mini
                    </Text>
                </View>
                <View style={[styles.feature]}>
                    <SvgXml
                        xml={BlueCheckSvg}
                    />
                    <Text style={[styles.featureText]}>
                        100% Ads Free
                    </Text>
                </View>
                <View style={[styles.feature]}>
                    <SvgXml
                        xml={BlueCheckSvg}
                    />
                    <Text style={[styles.featureText]}>
                        Unlimited Messages
                    </Text>
                </View>
                <View style={[styles.feature]}>
                    <SvgXml
                        xml={BlueCheckSvg}
                    />
                    <Text style={[styles.featureText]}>
                        Voice Chat Available
                    </Text>
                </View>
                <View style={[styles.feature, { borderBottomWidth: 1, paddingBottom: responsiveFontSize(2) }]}>
                    <SvgXml
                        xml={BlueCheckSvg}
                    />
                    <Text style={[styles.featureText]}>
                        Updated Prompts 24/7
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <Text style={[styles.termsTxt, { color: themeColors.white }]}>* </Text>
                    <Pressable
                        style={{ alignSelf: 'center' }}
                        onPress={() => {
                            Linking.openURL("https://www.akromaxtech.com/terms-conditions")
                        }}
                    >
                        <Text style={[styles.termsTxt, { color: themeColors.malibu }]}>Terms & Conditions</Text>

                    </Pressable>
                    <Text style={[styles.termsTxt, { color: themeColors.white }]}> are applied. </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <Text style={[styles.termsTxt, { color: themeColors.white }]}>* Agree to our </Text>
                    <Pressable
                        style={{ alignSelf: 'center' }}
                        onPress={() => {
                            Linking.openURL("https://www.akromaxtech.com/terms-conditions")
                        }}
                    >
                        <Text style={[styles.termsTxt, { color: themeColors.malibu }]}>Privacy Policy</Text>

                    </Pressable>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: responsiveFontSize(1.8),
        width: '33%',
        flexDirection: 'row',
        backgroundColor: themeColors.blackLight,
        borderRadius: 10,
        borderColor: themeColors.dark,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
    },
    saveView: {
        padding: responsiveFontSize(0.5),
        paddingHorizontal: responsiveFontSize(1),
        borderRadius: responsiveFontSize(0.5),
    },
    offPercentView: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        padding: responsiveFontSize(0.5),
        paddingHorizontal: responsiveFontSize(1.5),
        borderRadius: responsiveFontSize(2),
    },

    fourthview5: {
        width: responsiveScreenWidth(5),
        height: responsiveScreenHeight(5),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 5
    },
    feature: {
        borderColor: themeColors.osloGray,
        paddingBottom: 10,
        flexDirection: 'row',
        gap: responsiveFontSize(1)

    },
    featureText: {
        fontSize: responsiveScreenFontSize(1.5),
        color: themeColors.white,
        fontFamily: FONTS.Manrope_SemiBold,

    },


    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    description: {
        fontSize: responsiveScreenFontSize(2),
        color: themeColors.white,
        fontFamily: FONTS.Manrope_ExtraBold,
        textAlign: 'right'
    },
    termsTxt: {
        fontSize: responsiveScreenFontSize(1.3),
        color: themeColors.white,
        fontFamily: FONTS.Manrope_Medium,
    },
    saveTxt: {
        fontSize: responsiveScreenFontSize(1.5),
        color: themeColors.white,
        fontFamily: FONTS.Manrope_Bold,
    },
    smallDescription: {
        fontSize: responsiveScreenFontSize(1.5),
        color: themeColors.white,
        fontFamily: FONTS.Manrope,
        alignSelf: 'flex-end',
        textAlign: 'right'
    },
    headerText: {
        fontSize: responsiveScreenFontSize(2.5),
        color: themeColors.white,
        fontFamily: FONTS.Manrope_ExtraBold,
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    cardinnerview: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'red'
    }
});

export default CustomCard;
