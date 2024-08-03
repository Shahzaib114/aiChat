import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import OnboardingStack from "../onboarding/onboarding-stack.tsx";
import { Platform, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeStack from "../home-entry/home-stack.tsx";
import themeColors from "../../theme/colors.ts";
import Offer from "../common/Offer.tsx";
import ChatScreen from "../history/chat/chat.tsx";
import { useEffect } from "react";
import { clearProductsIOS, clearTransactionIOS, endConnection, getAvailablePurchases, initConnection } from "react-native-iap";


const Stack = createNativeStackNavigator();


export default function Root({ onboarded }: {
    onboarded: string
}) {
    useEffect(() => {
        const initIAP = async () => {
            try {
                await initConnection().then(async (res) => {
                    // if (Platform.OS === 'ios') {
                    //     const availablePurchases = await getAvailablePurchases();
                    //     if (availablePurchases.length > 0) {
                    //         await clearTransactionIOS();
                    //         await clearProductsIOS();
                    //     }
                    // }
                });
            } catch (err) {
                console.log('err in restore', err);
            }
        };

        initIAP();

        return () => {
            endConnection();
        };
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: themeColors.black }}>
            <NavigationContainer>

                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                    initialRouteName={onboarded ? 'home-entry' : 'onboarding-entry'}
                >
                    <Stack.Screen
                        name={'onboarding-entry'}
                        component={OnboardingStack} />
                    <Stack.Screen
                        name={'home-entry'}
                        component={HomeStack} />
                    <Stack.Screen
                        name={'chat'}
                        initialParams={{
                            inboxRef: "-1"
                        }}
                        options={{}}
                        component={ChatScreen} />
                    <Stack.Screen
                        name={'Offer'}
                        component={Offer} />
                </Stack.Navigator>

            </NavigationContainer>
        </View>
    );
}