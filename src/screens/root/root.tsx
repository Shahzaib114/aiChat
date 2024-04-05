import {NavigationContainer} from "@react-navigation/native";
import * as React from "react";
import OnboardingStack from "../onboarding/onboarding-stack.tsx";
import {View} from "react-native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeStack from "../home-entry/home-stack.tsx";


const Stack = createNativeStackNavigator();


export default function Root() {
    return (
        <View style={{flex: 1,}}>
            <NavigationContainer>

                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Stack.Screen
                        name={'onboarding-entry'}
                        component={OnboardingStack}/>
                    <Stack.Screen
                        name={'home-entry'}
                        component={HomeStack}/>
                </Stack.Navigator>

            </NavigationContainer>
        </View>
    );
}