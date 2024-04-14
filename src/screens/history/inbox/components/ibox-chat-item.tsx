import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../../utils/types.ts";
import themeColors from "../../../../theme/colors.ts";
import SvgImport from "../../../../utils/import-svg.tsx";
import deleteIcon from "../../../../../assets/svgs/deleteIcon.js";
import {useNavigation} from "@react-navigation/native";


export interface InBoxItemProps extends IDefaultProps {
    title: string,
    totalMessages: number,
    time: string,
}

const InBoxItem: FC<InBoxItemProps> = ({...props}) => {
    const navigation = useNavigation();
    return (
        <Pressable
            onPress={() => {
                // @ts-ignore
                navigation.navigate("chat")
            }}

            style={styles.container}>
            <View style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "flex-start",
                justifyContent: "center",
            }}>
                <Text style={styles.text}>
                    {props.title}
                </Text>
                <SvgImport svg={deleteIcon} style={{marginLeft: 6}}/>

            </View>
            <View style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "flex-start",
                justifyContent: "center",
            }}>
                <Text style={styles.messagesCount}>
                    {props.totalMessages} messages
                </Text>
                <View style={{flex: 1}}/>
                <Text style={{
                    fontFamily: "Manrope",
                    color: "#FFFFFF",
                    fontSize: 12,
                }}>
                    {props.time}
                </Text>

            </View>
        </Pressable>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        width: "100%",
        borderBottomColor: themeColors.blackLight,
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 10,
    },
    text: {
        fontFamily: "Manrope",
        color: themeColors.white,
        fontSize: 16,
        flex: 1,
        fontWeight: "400",
    },
    messagesCount: {
        fontFamily: "Manrope",
        color: themeColors.white,
        fontSize: 12,
        fontWeight: "400",
        backgroundColor: themeColors.blackLight,
        borderRadius: 1000,
        paddingHorizontal: 10,
        paddingVertical: 4,
    }
})


export default InBoxItem