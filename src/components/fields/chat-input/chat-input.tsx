import React, { FC, useEffect } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { IDefaultProps } from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";
import SvgImport from "../../../utils/import-svg.tsx";
import retry from "../../../../assets/svgs/retry.js";
import InputSendButton from "./input-send-button.tsx";
import { useHeaderHeight } from '@react-navigation/elements';


interface ChatInputProps extends IDefaultProps {
    onSend?: (message: string) => void,
    disabled?: boolean,
    onRetry?: () => void,
    resetChat?: string,
    chatInputStyle?: any;
    iosHeight?: any;
}

const InputHeight = 55;
const ChatInput: FC<ChatInputProps> = ({ ...props }) => {
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

    const height = useHeaderHeight()
    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? props.iosHeight == 10 ? height + 10 : height + 37 : 0}
            behavior={Platform.OS === 'ios' ? "padding" : 'height'}
            style={[props.chatInputStyle]}
        >
            <View
                style={styles.container}>
                <Pressable
                    disabled={props.disabled}
                    onPress={props.onRetry}
                ><SvgImport style={{
                    marginLeft: 20,
                }} svg={retry} />
                </Pressable>

                <TextInput
                    disabled={props.disabled}
                    style={{
                        color: themeColors.white,
                        fontWeight: "400",
                        paddingRight: InputHeight || 0,
                        width: '70%',
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
                    onPress={handleButton} />
            </View>
        </KeyboardAvoidingView>

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