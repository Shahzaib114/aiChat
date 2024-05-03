import React, {FC, useEffect} from "react";
import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";
import SvgImport from "../../../utils/import-svg.tsx";
import retry from "../../../../assets/svgs/retry.js";
import mic from "../../../../assets/svgs/mic.js";
import send from "../../../../assets/svgs/send.js";
import box from "../../../../assets/svgs/box.js";
import InputSendButton from "./input-send-button.tsx";


interface ChatInputProps extends IDefaultProps {
    onSend?: (message: string) => void,
    disabled?: boolean,
    onRetry?: () => void,
}

const InputHeight = 55;
const ChatInput: FC<ChatInputProps> = ({...props}) => {
    const [message, setMessage] = React.useState<string>("");
    const [type, setType] = React.useState<"text" | "voice" | "default">("default");

    useEffect(() => {
        if (message.length > 0) {
            setType("text")
        } else {
            setType("default")
        }
    }, [message]);

    function handleButton() {
        console.log("handleButton")
        if (message.trim().length > 0 && type === "text") {
            if (props.onSend) {
                props.onSend(message.trim())
            }
        } else if (type === "default" && message.trim() === "") {
            setType("voice")
        } else {
            setType("default")
        }


        setMessage("")
    }

    return (
        <View style={styles.container}>
            <Pressable
                disabled={props.disabled}
                onPress={props.onRetry}
            ><SvgImport style={{
                marginLeft: 20,
            }} svg={retry}/>
            </Pressable>
            <TextInput
                disabled={props.disabled}
                style={{
                    flex: 1,
                    color: themeColors.white,
                    fontWeight: "400",
                    paddingRight: InputHeight || 0,

                    fontSize: 13,
                    fontFamily: "Manrope",
                }}

                value={message}
                onChangeText={(text) => setMessage(text)}
                placeholder={"Ask me whatever you want..."}
                placeholderTextColor={themeColors.white + "80"}
                {...props}
            />

            <InputSendButton type={type} disabled={props.disabled}
                             height={InputHeight - 7}
                             onSpeechToText={(text) => setMessage(text)}
                             setType={setType}
                             onPress={handleButton}/>
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        width: "100%",
        position: "relative",
        borderRadius: 1000,
        height: InputHeight,
        backgroundColor: themeColors.blackLight,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    }
})


export default ChatInput