import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import OnboardingStack from "../onboarding/onboarding-stack.tsx";
import { Platform, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeStack from "../home-entry/home-stack.tsx";
import themeColors from "../../theme/colors.ts";
import Offer from "../common/Offer.tsx";
import Purchases from 'react-native-purchases';
import { REVENUE_CAT_ANDROID_APIKEY, REVENUE_CAT_IOS_APIKEY } from "../../utils/app-config.ts";


const Stack = createNativeStackNavigator();


export default function Root() {
    if (Platform.OS === 'android') {
        Purchases.configure({ apiKey: REVENUE_CAT_ANDROID_APIKEY });
    } else if (Platform.OS === 'ios') {
        Purchases.configure({ apiKey: REVENUE_CAT_IOS_APIKEY });
    }

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