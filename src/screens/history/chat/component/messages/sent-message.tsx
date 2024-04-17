import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps, IMessage} from "../../../../../utils/types.ts";
import themeColors from "../../../../../theme/colors.ts";
import SvgImport from "../../../../../utils/import-svg.tsx";
import copy from "../../../../../../assets/svgs/copy.js";
import share from "../../../../../../assets/svgs/share.js";


interface SentMessageProps extends IDefaultProps, IMessage {

}

const SentMessage: FC<SentMessageProps> = ({...props}) => {

    function getFormattedTime() {
        return `${props.createdAt.getHours() % 12}:${props.createdAt.getMinutes() > 9 ? props.createdAt.getMinutes() : `0${props.createdAt.getMinutes()}`} ${
            props.createdAt.getHours() > 12 ? "PM" : "AM"
        }`
    }

    return (
        <View style={styles.container}>
            <View style={{
                maxWidth: "70%",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 5,
            }}>
                <Text style={styles.text}>{
                    props.text
                }</Text>
                <View style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                    <SvgImport svg={copy}/>
                    <SvgImport svg={share}/>
                    <View style={{flex:1}} />
                    <Text style={styles.time}>{getFormattedTime()}</Text>
                </View>
            </View>
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        justifyContent: "flex-end",

    },
    time: {
        fontSize: 12,
        color: themeColors.white,
        opacity: 0.5,
    },
    text: {
        fontSize: 14,

        fontWeight: "500",
        borderRadius: 12,
        borderTopRightRadius: 0,
        color: "white",
        alignSelf: "flex-end",
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontFamily: "Manrope",
        backgroundColor: themeColors.blue,
    }
})


export default SentMessage