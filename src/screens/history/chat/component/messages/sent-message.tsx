import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps, IMessage} from "../../../../../utils/types.ts";
import themeColors from "../../../../../theme/colors.ts";
import SvgImport from "../../../../../utils/import-svg.tsx";
import copy from "../../../../../../assets/svgs/copy.js";
import share from "../../../../../../assets/svgs/share.js";
import {formateDateTo12HoursTime} from "../../../../../utils/formate-date.ts";
import shareChat from "../../../../../../assets/svgs/shareChat.js";
import {CopyToClipboard, shareText} from "../../../../../utils/utils.ts";
import {App_NAME} from "../../../../../utils/app-config.ts";


interface SentMessageProps extends IDefaultProps, IMessage {

}

const SentMessage: FC<SentMessageProps> = ({...props}) => {

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
                    paddingLeft: 10,
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
        minWidth: 120,
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