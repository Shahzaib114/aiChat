import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import OnboardingScreen from "./onboarding-screen.tsx";

const Stack = createNativeStackNavigator();

interface OnboardingStackProps extends IDefaultProps {

}

const OnboardingStack: FC<OnboardingStackProps> = ({...props}) => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={'Onboarding-screen'}
        >
            <Stack.Screen
                name={'Onboarding-screen'}
                component={OnboardingScreen}/>
        </Stack.Navigator>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default OnboardingStack;