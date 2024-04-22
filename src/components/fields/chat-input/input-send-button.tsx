import React, {FC, useEffect} from "react";
import {Pressable, PressableProps, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";
import SvgImport from "../../../utils/import-svg.tsx";
import mic from "../../../../assets/svgs/mic.js";
import send from "../../../../assets/svgs/send.js";
import box from "../../../../assets/svgs/box.js";
import {Animated} from "react-native";
import LottieView from "lottie-react-native";

export type InputSendButtonProps = IDefaultProps & PressableProps & {
    type: "text" | "voice" | "default",
    height?: number,
    setType?: (type: "text" | "voice" | "default") => void,
}

const InputSendButton: FC<InputSendButtonProps> = ({type, height, ...props}) => {


    return (
        <View style={{
            position: "absolute",
            right: 4,
            borderRadius: 1000,
            flexDirection: "row",
            backgroundColor: themeColors.blackLight,
            width: type === "voice" ? "95%" : "auto",
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
                        display: type === "voice" ? "flex" : "none",
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
                        Listening...
                    </Text>
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
                    disabled={props.disabled}
                    style={{
                        width: height,
                        height: height,
                        alignSelf: "flex-end",
                        borderRadius: 1000,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: type === "voice" ? themeColors.red : themeColors.primary,
                    }}>
                    {type === "default" && <SvgImport svg={mic}/>}
                    {type === "text" && <SvgImport svg={send}/>}
                    {type === "voice" && <SvgImport svg={box}/>}

                </Pressable>
            </View>

        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default InputSendButton