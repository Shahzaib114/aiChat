import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Pressable, Linking} from 'react-native';
import {
    responsiveFontSize,
    responsiveScreenFontSize,
    responsiveScreenHeight,
    responsiveScreenWidth
} from 'react-native-responsive-dimensions';
import FONTS from '../../theme/FONTS';
import themeColors from '../../theme/colors';
import Vector from '../../../assets/svgs/vector';
import {SvgXml} from 'react-native-svg';
import CheckBox from "../check-box/check-box.tsx";
import Toast from "react-native-simple-toast";

const CustomCard = ({description, text, smallDesc, save, isCircleActive, purchased, handleCardPress}: any) => {
    const [Agree, setAgree] = React.useState(false)
    return (
        <TouchableOpacity
            onPress={() => {
                if (!Agree) {
                    Toast.show('Please agree to the terms and conditions to proceed', Toast.SHORT)
                    return;
                }
                handleCardPress()
            }}

            style={[styles.card, {alignItems: 'flex-start', flexDirection: "column", gap: 10}]}
        >

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <View style={styles.cardinnerview}>
                    <View>
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={[
                                    styles.circle,
                                    {backgroundColor: isCircleActive ? '#02A67E' : 'grey',},
                                ]}
                            />
                            <Text style={styles.headerText}>{text.replace('(EVA: Your AI Assistant)', '')}</Text>
                        </View>
                        <View>
                            <Text style={styles.description}>
                                {save?.includes('weekly') ?
                                    '14.99$'
                                    :
                                    save?.includes('monthly') ?
                                        '9.19$'
                                        :
                                        save?.includes('yearly') &&
                                        '34.99$'
                                }
                                <Text style={styles.smallDescription}>
                                    {save?.includes('weekly') ?
                                        '/week'
                                        :
                                        save?.includes('monthly') ?
                                            '/month'
                                            :
                                            save?.includes('yearly') &&
                                            '/year'
                                    }
                                </Text>
                            </Text>
                        </View>
                    </View>
                    {save?.includes('yearly') &&
                        <View style={styles.saveView}>
                            <Text style={styles.saveTxt}>
                                80% off
                            </Text>
                        </View>
                    }
                </View>
                {purchased ?
                    <View style={[styles.saveView, {backgroundColor: themeColors.primary}]}>
                        <Text style={styles.saveTxt}>
                            Active
                        </Text>
                    </View>
                    :
                    <View style={styles.fourthview5}>
                        <SvgXml xml={Vector} width="100%" height="100%" style={{alignSelf: 'flex-start'}}/>
                    </View>
                }
            </View>
            <View
                style={{

                    width: '100%',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
                <View style={[styles.feature]}>
                    <Text style={[styles.featureText]}>
                        - Improved AI performance
                    </Text>
                </View>
                <View style={[styles.feature]}>
                    <Text style={[styles.featureText]}>
                        - Gpt-4 access
                    </Text>
                </View>
                <View style={[styles.feature]}>
                    <Text style={[styles.featureText]}>
                        - No ads
                    </Text>
                </View>
                <View style={[styles.feature]}>
                    <Text style={[styles.featureText]}>
                        - Unlimited messages for {

                        save?.includes('weekly') ?
                            '7 days'
                            :
                            save?.includes('monthly') ?
                                '30 days'
                                :
                                save?.includes('yearly') &&
                                '365 days'


                    } to chat with EVA
                    </Text>
                </View>
                <View style={[styles.feature, {borderBottomWidth: 0}]}>
                    <Text style={[styles.featureText]}>
                        - More detailed answers
                    </Text>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '100%',
                gap: 1,
            }}>
                <CheckBox checked={Agree} onChange={setAgree}/>

                <Text style={{color: themeColors.white, marginLeft:10}}>I agree to the </Text>
                <Pressable
                    onPress={() => {
                        Linking.openURL("https://www.akromaxtech.com/terms-conditions")
                    }}
                >
                    <Text style={{color: themeColors.primary}}>Terms and Conditions</Text>
                </Pressable>

            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: responsiveFontSize(1.8),
        width: '95%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: themeColors.blackLight,
        borderRadius: 10,
        borderColor: themeColors.dark,
        borderWidth: 1
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    saveView: {
        backgroundColor: themeColors.blue,
        alignSelf: 'baseline',
        marginLeft: 4,
        padding: responsiveFontSize(0.5),
        borderRadius: responsiveFontSize(1.5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    fourthview5: {
        width: responsiveScreenWidth(5),
        height: responsiveScreenHeight(5),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 5
    },
    feature: {
        borderBottomWidth: 1,
        borderBottomColor: themeColors.dark,
        paddingBottom: 10,

    },
    featureText: {
        color: themeColors.white,
    },


    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    description: {
        fontSize: responsiveScreenFontSize(4),
        color: themeColors.white,
        fontFamily: FONTS.Manrope_ExtraBold
    },
    saveTxt: {
        fontSize: responsiveScreenFontSize(1.5),
        color: themeColors.black,
        fontFamily: FONTS.Manrope_Regular,
        paddingHorizontal: 5
    },
    smallDescription: {
        fontSize: responsiveScreenFontSize(2),
        color: themeColors.white,
        fontFamily: FONTS.Manrope_SemiBold
    },
    headerText: {
        fontSize: responsiveScreenFontSize(2),
        color: themeColors.white,
        fontFamily: FONTS.Manrope_Light
    },
    cardinnerview: {
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default CustomCard;
