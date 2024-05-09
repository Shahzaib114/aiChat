import React, {FC} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types";
import {responsiveFontSize, responsiveScreenWidth} from "react-native-responsive-dimensions";
import themeColors from "../../theme/colors";
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import FONTS from "../../theme/FONTS";

interface HomeProps extends IDefaultProps {
    image: any,
    review: string,
    name: string
}

const Review: FC<HomeProps> = ({...props}) => {
    let ratingsNumber = 3;

    return (
        <View style={styles.card}>
            <View style={styles.imageview}>
                <Image source={props.image}
                       resizeMode="contain"
                       style={styles.image}
                />
            </View>
            <View style={styles.starview}>
                <Text style={[styles.txtStyle, {color: themeColors.white}]}>{props.name}</Text>
                <View style={styles.starContainer}>
                    <StarRatingDisplay
                        rating={ratingsNumber}
                        starStyle={{width: responsiveScreenWidth(1), left: -7}}
                        starSize={responsiveFontSize(2)}
                    />
                </View>
                <Text style={[styles.txtStyle, {width: '100%'}]}>{props.review}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: themeColors.blackLight,
        borderRadius: 10,
        padding: responsiveFontSize(2),
        width: '95%',
        marginBottom: "5%",
        flexDirection: 'row',
        gap: 10
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: responsiveFontSize(4),
        marginBottom: responsiveFontSize(0.5),
    },
    txtStyle: {
        color: themeColors.secondary,
        fontFamily: FONTS.Manrope_Regular
    },
    imageview: {
        width: responsiveFontSize(4),
        height: responsiveFontSize(4)
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius:1000,
    },
    starview: {
        width: '90%',
        gap: 5
    }

});

export default Review;
