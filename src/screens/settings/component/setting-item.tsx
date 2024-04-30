import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";


export interface SettingsItemProps extends IDefaultProps {
    title?: string
    icon?: React.ReactNode
    onClick?: () => void
    hasBottomBorder?: boolean,
    endIcon?: React.ReactNode

}

const SettingsItem: FC<SettingsItemProps> = ({...props}) => {

    return (
        <Pressable
            onPress={props.onClick}
            style={{
                paddingVertical: 20,
                paddingHorizontal: 20,
                borderBottomWidth: props.hasBottomBorder ? 1 : 0,
                borderBottomColor: "#FFFFFF10",
                gap: 15,
                alignItems: "center",
                flexDirection: "row",
            }}>
            {
                props.icon
            }
            <Text
                style={{
                    color: "#ffffff",
                    fontSize: 18,
                    fontWeight: "400",
                    flex: 1,
                }}
            >{
                props.title
            }</Text>
            {
                props.endIcon
            }

        </Pressable>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default SettingsItem