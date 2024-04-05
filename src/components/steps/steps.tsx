import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";


interface StepsProps extends IDefaultProps {
    totalSteps: number;
    currentStep: number;

}

const Steps: FC<StepsProps> = ({...props}) => {

    return (
        <View style={[styles.container, props.style]}>
            {
                Array.from({length: props.totalSteps}, (_, index) => {
                    return (
                        <View
                            key={index}
                            style={{
                                ...styles.step,
                                backgroundColor: index === props.currentStep ? '#FEDF00' : '#D9D9D9',
                            }}
                        />
                    )
                })
            }
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        gap: 4,
    },
    step: {
        width: 20,
        height: 4,
        borderRadius: 1000,
    }
})

export default Steps;