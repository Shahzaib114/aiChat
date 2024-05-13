import React, { FC } from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { IDefaultProps } from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";
import hand from "../../../../assets/svgs/hand.js";
import SvgImport from "../../../utils/import-svg.tsx";

interface HomeHeaderProps extends IDefaultProps {

}

const HomeHeader: FC<HomeHeaderProps> = ({ ...props }) => {

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={themeColors.black} barStyle={'light-content'} />
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.text}>Hi </Text>
                <SvgImport svg={hand} style={{ marginLeft: 6 }} />


            </View>
        </SafeAreaView>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        backgroundColor: themeColors.black,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    text: {
        fontFamily: "Manrope",
        color: themeColors.white,
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: Platform.OS === 'ios' ? 15 : 0,
    }
})


export default HomeHeader