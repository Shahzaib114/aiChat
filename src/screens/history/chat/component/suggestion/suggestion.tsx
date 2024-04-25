import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../../../utils/types.ts";
import themeColors from "../../../../../theme/colors.ts";
import {ISuggestionItem} from "./types.ts";


interface SuggestionComponentProps extends IDefaultProps {
    suggestions: ISuggestionItem[],
    onClick?: (suggestion: ISuggestionItem) => void,
}

const SuggestionComponent: FC<SuggestionComponentProps> = ({...props}) => {

    return (
        <View style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <View style={styles.container}>
                {
                    props.suggestions.map((suggestion, index) => {
                        return (
                            <Pressable
                                onPress={() => props.onClick && props.onClick(suggestion)}
                                key={index}
                            >
                                <Text
                                    style={styles.text}

                                >
                                    {suggestion.label}
                                </Text>
                            </Pressable>
                        )
                    })
                }
            </View>
            <View
                style={{
                    width: "20%",
                    height: 4,
                    backgroundColor: themeColors.blackLight,
                    marginVertical: 20,
                    borderRadius: 1000,
                }}
            />
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: "row",
        gap: 14,
        marginTop: 20,
    },
    text: {
        fontSize: 14,
        fontWeight: "500",
        fontFamily: "Manrope",
        backgroundColor: themeColors.blackLight,
        padding: 14,
        borderRadius: 1000,
        color: themeColors.white,
        paddingHorizontal: 20,
    }
})


export default SuggestionComponent