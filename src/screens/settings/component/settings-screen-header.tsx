import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {IDefaultProps} from "../../../utils/types.ts";
import SvgImport from "../../../utils/import-svg.tsx";
import Left from "../../../../assets/svgs/left.js";
import themeColors from "../../../theme/colors.ts";

interface ChatScreenHeaderProps extends IDefaultProps {
    title?: string
}

const SettingScreenHeader: FC<ChatScreenHeaderProps> = ({...props}) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
            }}>

                <Pressable
                    onPress={() => {
                        // @ts-ignore
                        navigation.goBack();
                    }}
                >

                    <SvgImport svg={Left}/>
                </Pressable>
                <Text style={styles.text}>
                    Settings
                </Text>



            </View>
        </View>
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
        fontSize: 18,
        fontWeight: "500",
        flex: 1,
    }
})


export default SettingScreenHeader