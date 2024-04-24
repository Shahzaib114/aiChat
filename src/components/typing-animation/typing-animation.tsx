import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";
import LottieView from "lottie-react-native";


interface TypingAnimationProps extends IDefaultProps {

}

const TypingAnimation: FC<TypingAnimationProps> = ({...props}) => {

    return (

        <LottieView source={require('../../../assets/anim/typing.json')}
                    style={styles.anim}
                    autoPlay loop/>


    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    anim: {
        height: 60,
        width: 60,
        justifyContent: "flex-start",
        alignItems: "center",

    }
})


export default TypingAnimation