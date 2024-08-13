import React, { FC } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IDefaultProps } from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";

interface ChatScreenHeaderProps extends IDefaultProps {
    title?: string
}

const SubscriptionScreenHeader: FC<ChatScreenHeaderProps> = ({ ...props }) => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
         
        </SafeAreaView>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        paddingVertical: 26,
        paddingHorizontal: 20,
        backgroundColor: themeColors.black,
        borderBottomWidth: 2,
        borderBottomColor: themeColors.blackLight,
    },
    text: {
        fontFamily: "Manrope",
        color: themeColors.white,
        fontSize: 20,
        fontWeight: "500",
        flex: 1,
    },
    backArrowContainer: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
})


export default SubscriptionScreenHeader