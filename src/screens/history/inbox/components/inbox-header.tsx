import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../../utils/types.ts";
import themeColors from "../../../../theme/colors.ts";
import SvgImport from "../../../../utils/import-svg.tsx";
import LeftIcon from "../../../../components/icons/left.tsx";
import {useNavigation} from "@react-navigation/native";

interface InBoxHeaderProps extends IDefaultProps {
    onClearChats?: () => void
}

const InBoxHeader: FC<InBoxHeaderProps> = ({...props}) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
            }}>
                <Pressable
                    onPress={() => {
                        navigation.goBack()
                    }}
                >

                    <SvgImport svg={LeftIcon}/>
                </Pressable>
                <Text style={styles.text}>
                    Chats History
                </Text>

                <Pressable
                    onPress={props.onClearChats}
                >
                    <Text style={{
                        color: themeColors.red,
                        fontSize: 18,
                    }}>
                        X Clear Chats

                    </Text>
                </Pressable>

            </View>
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        paddingVertical: 26,
        paddingHorizontal: 20,
        backgroundColor: themeColors.black,
        borderBottomWidth: 2,
        borderBottomColor: themeColors.blackLight,
    },
    text: {
        fontFamily: "Manrope",
        color: themeColors.white,
        fontSize: 18,
        fontWeight: "500",
        flex: 1,
    }
})


export default InBoxHeader