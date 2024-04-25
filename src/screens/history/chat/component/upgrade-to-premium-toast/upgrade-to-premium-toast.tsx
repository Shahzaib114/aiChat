


import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../../../utils/types.ts";
import themeColors from "../../../../../theme/colors.ts";



interface UpgradeToPremiumToastProps extends IDefaultProps {

}

const UpgradeToPremiumToast: FC<UpgradeToPremiumToastProps> = ({...props}) => {

    return (
            <Text
            style={{
                backgroundColor: "#D9D9D9",
                width: "100%",
                color: themeColors.black,
                textAlign: "center",
                fontSize: 15,
                fontWeight: "400",
                paddingHorizontal: 25,
                borderRadius: 10000,
                paddingVertical: 12,
            }}
            >Upgrade to premium now for more messages.</Text>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default UpgradeToPremiumToast