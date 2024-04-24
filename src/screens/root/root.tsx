import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import OnboardingStack from "../onboarding/onboarding-stack.tsx";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeStack from "../home-entry/home-stack.tsx";
import themeColors from "../../theme/colors.ts";
import Offer from "../common/Offer.tsx";
import Purchases from 'react-native-purchases';


const Stack = createNativeStackNavigator();


export default function Root() {
    Purchases.configure({ apiKey: 'goog_DbsmqjKJErmJRYilobSziDRYfsf' });

    return (
        <View style={{ flex: 1, backgroundColor: themeColors.black }}>
            <NavigationContainer>

                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Stack.Screen
                        name={'onboarding-entry'}
                        component={OnboardingStack} />
                    <Stack.Screen
                        name={'home-entry'}
                        component={HomeStack} />
                    <Stack.Screen
                        name={'Offer'}
                        component={Offer} />
                </Stack.Navigator>

            </NavigationContainer>
        </View>
    );
}