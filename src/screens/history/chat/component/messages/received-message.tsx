import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps, IMessage} from "../../../../../utils/types.ts";
import themeColors from "../../../../../theme/colors.ts";
import SvgImport from "../../../../../utils/import-svg.tsx";
import copy from "../../../../../../assets/svgs/copy.js";
import share from "../../../../../../assets/svgs/share.js";
import bot from "../../../../../../assets/svgs/bot.js";
import speaker from "../../../../../../assets/svgs/speakr.js";



interface ReceivedMessageProps extends IDefaultProps, IMessage {

}

const ReceivedMessage: FC<ReceivedMessageProps> = ({...props}) => {

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
                <View style={styles.messageContainer}>
                    <SvgImport svg={bot}/>
                    <Text style={styles.text}>{props.text}</Text>

                </View>
                <View style={{
                    flexDirection: "row-reverse",
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                    <SvgImport svg={copy}/>
                    <SvgImport svg={share}/>
                    <SvgImport svg={speaker}/>
                    <View style={{flex: 1}}/>
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
        justifyContent: "flex-start",

    },
    time: {
        fontSize: 12,
        color: themeColors.white,
        opacity: 0.5,
    },
    text: {
        fontSize: 14,

        fontWeight: "500",
        color: themeColors.black,
        fontFamily: "Manrope",
    },
    messageContainer: {
        borderRadius: 12,
        flexDirection: "row",
        width: "100%",
        gap: 10,
        borderTopLeftRadius: 0,
        paddingHorizontal: 10,
        paddingRight: 22,
        paddingVertical: 10,
        backgroundColor: themeColors.white,
    }
})


export default ReceivedMessage