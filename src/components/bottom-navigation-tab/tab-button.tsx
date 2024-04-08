import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";
import SvgImport from "../../utils/import-svg.tsx";
import themeColors from "../../theme/colors.ts";


interface TabButtonProps extends IDefaultProps {
    name: string,
    currentRoute: string,
    Icon: any,
    focused: boolean,

}

const TabButton: FC<TabButtonProps> = ({Icon, name, currentRoute,focused, ...props}) => {
    const color: string = focused ? themeColors.primary : "#fff";
    return (
        <View style={{
            flex: 1,
            borderTopWidth: focused? 2 : 0,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderColor: focused ? themeColors.primary : 'transparent',
        }}>

            <SvgImport svg={Icon(color)}/>
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {}
})


export default TabButton