import React, { FC } from "react";
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IDefaultProps } from "../../../utils/types.ts";
import SvgImport from "../../../utils/import-svg.tsx";
import Left from "../../../../assets/svgs/left.js";
import themeColors from "../../../theme/colors.ts";

interface ChatScreenHeaderProps extends IDefaultProps {
    title?: string
}

const SettingScreenHeader: FC<ChatScreenHeaderProps> = ({ ...props }) => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                marginLeft: Platform.OS === 'ios' ? 15 : 0,
            }}>

                <Pressable
                    style={styles.backArrowContainer}
                    onPress={() => {
                        // @ts-ignore
                        navigation.goBack();
                    }}
                >

                    <SvgImport svg={Left} />
                    <Text style={styles.text}>
                        Settings
                    </Text>
                </Pressable>



            </View>
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


export default SettingScreenHeader