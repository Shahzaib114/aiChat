import React, { FC } from "react";
import { Image, StyleSheet, Text, TextStyle, View } from "react-native";
import { IDefaultProps } from "../../utils/types";
import { responsiveFontSize, responsiveScreenWidth } from "react-native-responsive-dimensions";
import themeColors from "../../theme/colors";
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import FONTS from "../../theme/FONTS";

interface HomeProps extends IDefaultProps {
    image: any,
    review: string,
    name: string,
    ratingsNumber?: number | any,
    containerStyle?: TextStyle;
}

const Review: FC<HomeProps> = ({ containerStyle, ...props }) => {

    return (
        <View style={[styles.card, containerStyle]}>
            <View style={{ flexDirection: 'row', gap: 10, justifyContent:'flex-start', alignItems:'center' }}>
                <View style={styles.imageview}>
                    <Image source={props.image}
                        resizeMode="contain"
                        style={styles.image}
                    />
                </View>
                <View style={styles.starview}>
                    <Text style={[styles.txtStyle, { color: themeColors.white }]}>{props.name}</Text>
                    <View style={styles.starContainer}>
                        <StarRatingDisplay
                            rating={props?.ratingsNumber}
                            starStyle={{ width: responsiveScreenWidth(1), left: -7 }}
                            starSize={responsiveFontSize(2)}
                        />
                    </View>
                </View>
            </View>
            <Text
                numberOfLines={3}
                style={[styles.txtStyle, { width: '100%', fontFamily: FONTS.Manrope_Medium }]}>{props.review}</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: themeColors.midnightBlue,
        borderRadius: 10,
        padding: responsiveFontSize(2),
        width: '95%',
        marginBottom: "5%",
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: responsiveFontSize(4),
        marginBottom: responsiveFontSize(0.5),
    },
    txtStyle: {
        color: themeColors.white,
        fontFamily: FONTS.Manrope_Bold
    },
    imageview: {
        width: responsiveFontSize(4),
        height: responsiveFontSize(4)
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 1000,
    },
    starview: {
        width: '90%',
        gap: 5,
    }

});

export default Review;
