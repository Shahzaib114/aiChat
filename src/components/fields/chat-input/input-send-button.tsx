import React, {FC, useEffect} from "react";
import {ActivityIndicator, Pressable, PressableProps, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";
import SvgImport from "../../../utils/import-svg.tsx";
import mic from "../../../../assets/svgs/mic.js";
import send from "../../../../assets/svgs/send.js";
import box from "../../../../assets/svgs/box.js";
import {Animated} from "react-native";
import LottieView from "lottie-react-native";
import useSpeechToText from "../../../hooks/useSpeechToText.ts";
import {SpeechErrorEvent} from "@react-native-voice/voice";

export type InputSendButtonProps = IDefaultProps & PressableProps & {
    type: "text" | "voice" | "default",
    height?: number,
    setType?: (type: "text" | "voice" | "default") => void,
    onSpeechToText?: (text: string) => void
}

const InputSendButton: FC<InputSendButtonProps> = ({type, height, ...props}) => {
    const [startedRecording, processingSpeech, speechActions] = useSpeechToText((text) => {
        props.onSpeechToText?.(text)
        props.setType?.("text")

    }, (e: SpeechErrorEvent) => {
        props.setType?.("default")
    })


    useEffect(() => {
        if (type === "voice" && !startedRecording) {
            speechActions.start()
        }
        if (type !== "voice" && startedRecording) {
            speechActions.stop()
        }


    }, [type]);

    return (
        <View style={{
            position: "absolute",
            right: 4,
            borderRadius: 1000,
            flexDirection: "row",
            backgroundColor: themeColors.blackLight,
            width: type === "voice" || processingSpeech  ? "95%" : "auto",
        }}>
            <View
                style={{

                    flexDirection: "row",
                    flex: 1,

                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        display: type === "voice" || processingSpeech ? "flex" : "none",
                        flex: 1,

                    }}
                >
                    <Text
                        style={{
                            flex: 7,
                            color: themeColors.white,
                            fontWeight: "400",
                            fontSize: 14,
                            marginLeft: 10,
                            opacity: 0.5,
                        }}
                    >
                        {
                            processingSpeech ? "Processing Your speech" : "Listening..."
                        }                    </Text>
                    <LottieView
                        source={require("../../../../assets/anim/wave.json")}
                        style={{

                            height: 30,
                            flex: 1,
                        }}
                        autoPlay
                        loop={true}
                    />
                </View>
                <Pressable
                    {...props}

                    disabled={props.disabled || processingSpeech}
                    style={{
                        width: height,
                        height: height,
                        alignSelf: "flex-end",
                        borderRadius: 1000,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: type === "voice" || processingSpeech ? themeColors.red : themeColors.primary,
                    }}>
                    {type === "default" && !processingSpeech && <SvgImport svg={mic}/>}
                    {type === "text" && !processingSpeech && <SvgImport svg={send}/>}
                    {type === "voice" && !processingSpeech && <SvgImport svg={box}/>}
                    {
                        processingSpeech &&
                        <ActivityIndicator
                            style={{
                                width: 10,
                                height: 10
                            }}
                            color={'white'}
                        />
                    }

                </Pressable>
            </View>

        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default InputSendButton