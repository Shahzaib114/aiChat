import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../../../utils/types.ts";
import variantsStyles from "./notification-styles.ts";


interface NotificationBarProps extends IDefaultProps {
    variant: "error" | "success" | "info",
    message: string,
    onClick?: () => void,
}

const NotificationBar: FC<NotificationBarProps> = ({...props}) => {
    const variantStyle = variantsStyles[props.variant]
    return (
        <View style={[styles.container, variantStyle.container]}>
            <Text style={[styles.text, variantStyle.text]}>{
                props.message
            }</Text>
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >

                <Pressable onPress={props.onClick} style={styles.button}>
                    <Text style={[styles.buttonText, variantStyle.buttonText]}>Upgrade</Text>
                </Pressable>
            </View>
        </View>
    )
}


const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        gap: 40,
    },
    text: {
        fontSize: 16,
        flex: 1,
        fontWeight: "500",
        fontFamily: "Manrope",
    },
    button: {
        padding: 5,
        borderRadius: 1000,
        backgroundColor: "white",
        paddingHorizontal: 12,
    }
})

export default NotificationBar