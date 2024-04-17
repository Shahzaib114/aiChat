import React, {FC} from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";
import SvgImport from "../../../utils/import-svg.tsx";
import retry from "../../../../assets/svgs/retry.js";
import mic from "../../../../assets/svgs/mic.js";


interface ChatInputProps extends IDefaultProps {

}

const InputHeight = 55;
const ChatInput: FC<ChatInputProps> = ({...props}) => {

    return (
        <View style={styles.container}>
            <SvgImport svg={retry}/>
            <TextInput
                style={{
                    flex: 1,
                    color: themeColors.white,
                    fontWeight: "400",
                    fontSize: 13,
                    fontFamily: "Manrope",
                }}
                placeholder={"Ask me whatever you want..."}
                placeholderTextColor={themeColors.white}
                {...props}
            />

            <View style={{
                width: InputHeight - 7,
                height: InputHeight - 7,
                borderRadius: 1000,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: themeColors.primary,
            }}>
                <SvgImport svg={mic}/>
            </View>
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 1000,
        height: InputHeight,
        backgroundColor: themeColors.blackLight,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 5,
        paddingLeft: 20,
        paddingRight: 5,
    }
})


export default ChatInput