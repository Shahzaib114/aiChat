import React, {FC} from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";
import SvgImport from "../../../utils/import-svg.tsx";
import retry from "../../../../assets/svgs/retry.js";


interface ChatInputProps extends IDefaultProps {

}

const InputHiht = 55;
const ChatInput: FC<ChatInputProps> = ({...props}) => {

    return (
        <View style={styles.container}>
            <SvgImport svg={retry} />
            <TextInput
                style={{
                    flex: 1,
                    color: themeColors.white,
                    fontWeight: "400",
                    fontSize: 13,
                    fontFamily: "Manrope",
                }}
                placeholder={"Type a message"}
                placeholderTextColor={themeColors.white}
            />

            <View>

            </View>
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 1000,
        height: 55,
        backgroundColor: themeColors.blackLight,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 5,
        paddingHorizontal: 20,
    }
})


export default ChatInput