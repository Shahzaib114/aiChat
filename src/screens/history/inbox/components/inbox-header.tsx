import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../../utils/types.ts";
import themeColors from "../../../../theme/colors.ts";
import SvgImport from "../../../../utils/import-svg.tsx";
import LeftIcon from "../../../../components/icons/left.tsx";

interface InBoxHeaderProps extends IDefaultProps {

}

const InBoxHeader: FC<InBoxHeaderProps> = ({...props}) => {

    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
            }}>

                <SvgImport svg={LeftIcon}/>
                <Text style={styles.text}>
                    Chats History
                </Text>

                <Pressable>
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