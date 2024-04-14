



import React, {FC, useEffect} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";
import OnboardingStack from "../onboarding/onboarding-stack.tsx";
import HomeStack from "../home-entry/home-stack.tsx";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import InBoxHeader from "./inbox/components/inbox-header.tsx";
import InBox from "./inbox/inbox.tsx";
import ChatScreen from "./chat/chat.tsx";
import {useNavigation} from "@react-navigation/native";

const Stack = createNativeStackNavigator();

interface HistoryScreenProps extends IDefaultProps {

}

const HistoryScreen: FC<HistoryScreenProps> = ({...props}) => {


    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={'inbox'}
        >
            <Stack.Screen
                name={'inbox'}
                options={{
                    headerShown: true,
                    header: () => <InBoxHeader/>
                }}
                component={InBox}/>
            <Stack.Screen
                name={'chat'}
                options={{

                }}
                component={ChatScreen}/>
        </Stack.Navigator>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default HistoryScreen