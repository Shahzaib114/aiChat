import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps, IMessage} from "../../../../../utils/types.ts";
import themeColors from "../../../../../theme/colors.ts";
import SvgImport from "../../../../../utils/import-svg.tsx";
import copy from "../../../../../../assets/svgs/copy.js";
import share from "../../../../../../assets/svgs/share.js";
import bot from "../../../../../../assets/svgs/bot.js";
import speaker from "../../../../../../assets/svgs/speakr.js";
import {formateDateTo12HoursTime} from "../../../../../utils/formate-date.ts";
import shareChat from "../../../../../../assets/svgs/shareChat.js";
import {CopyToClipboard, shareText, TextToSpeech} from "../../../../../utils/utils.ts";
import {App_NAME} from "../../../../../utils/app-config.ts";


interface ReceivedMessageProps extends IDefaultProps, IMessage {

}

const ReceivedMessage: FC<ReceivedMessageProps> = ({...props}) => {

    function getFormattedTime() {
        if (typeof props.createdAt === "string") {
            return props.createdAt
        }
        if (!props.createdAt)
            return ""
        return formateDateTo12HoursTime(props.createdAt)
    }


    return (
        <View style={styles.container}>
            <View style={{
                maxWidth: "80%",
                paddingRight: 10,
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

                    <Pressable
                        onPress={() => CopyToClipboard(props.text)}
                    >
                        <SvgImport svg={copy}/>
                    </Pressable>

                    <Pressable
                        onPress={() => shareText(
                            `This message comes from ${App_NAME} app: ${props.text}`
                        )}
                    >
                        <SvgImport svg={shareChat}/>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            TextToSpeech(props.text)
                        }}
                        style={{
                            padding: 5,
                        }}

                    >

                        <SvgImport svg={speaker}/>
                    </Pressable>
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
        marginRight: 6,
        marginLeft: 6,
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
        paddingRight: 25,
        paddingVertical: 10,
        backgroundColor: themeColors.white,
    }
})


export default ReceivedMessage