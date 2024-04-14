import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";

export interface tabProps {
    text: string,
    id: number
}

interface TabComponentProps extends IDefaultProps {
    onPress?: () => void
    text: string,
    isSelected: boolean
}

const TabComponent: FC<TabComponentProps> = ({...props}) => {

    return (
        <Pressable style={[styles.button, {
            backgroundColor: props.isSelected ? themeColors.primary : themeColors.blackLight
        }]}
                   onPress={props.onPress}
        >
            <Text style={styles.text}>{props.text}</Text>
        </Pressable>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 17,
        marginLeft: 10,
        borderRadius: 100,
    },
    text: {
        fontSize: 14,
        color: themeColors.white

    }

})


export default TabComponent