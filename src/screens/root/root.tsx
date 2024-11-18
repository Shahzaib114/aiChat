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
import { getAvailablePurchases, initConnection } from "react-native-iap";
import Subscription from "../payments/subscription.tsx";
import { getDatabaseInstance } from "../../utils/firebaseInstance.tsx";
import useSession from "../../hooks/useSession.ts";


const Stack = createNativeStackNavigator();


export default function Root({ onboarded }: {
    onboarded: string
}) {
    // useEffect(() => {
    //     const initIAP = async () => {
    //         try {
    //             await initConnection().then(async (res) => {
    //                 console.log(res)

    //                 // if (Platform.OS === 'ios') {
    //                 //     const availablePurchases = await getAvailablePurchases();
    //                 //     if (availablePurchases.length > 0) {
    //                 //         await clearTransactionIOS();
    //                 //         await clearProductsIOS();
    //                 //     }
    //                 // }
    //             });
    //         } catch (err) {
    //             console.log('err in restore', err);
    //         }
    //     };

    //     initIAP();

    //     // Purchase listener setup
    //     const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
    //         try {
    //             console.log('Purchase event:', purchase);

    //             const receipt = purchase.transactionReceipt;
    //             if (receipt) {
    //                 // Validate receipt with your backend
    //                 // const isValid = await validateReceiptWithServer(receipt);

    //                 // if (isValid) {
    //                 //     // Mark purchase as complete on the device
    //                 //     await finishTransaction({ purchase, isConsumable: false });
    //                 // } else {
    //                 //     console.warn('Invalid purchase receipt');
    //                 // }
    //             }
    //         } catch (error) {
    //             console.error('Purchase processing error:', error);
    //         }
    //     });

    //     return () => {
    //         // Clean up the listener and end IAP connection when component unmounts
    //         if (purchaseUpdateSubscription) {
    //             purchaseUpdateSubscription.remove();
    //         }
    //         endConnection();
    //     };

    //     // return () => {
    //     //     endConnection();
    //     // };
    // }, []);

    const [session] = useSession()


    useEffect(() => {
        // Function to initialize IAP connection
        const initIAP = async () => {
            try {
                const connection = await initConnection();
                console.log('IAP Connection:', connection);
            } catch (err) {
                console.log('Error in initializing IAP or restoring purchases:', err);
            }
        };

        // Initialize IAP connection when component mounts
        initIAP();
        checkActiveSubscription()

    }, []);

    const checkActiveSubscription = async () => {
        try {
            const databaseInstance = await getDatabaseInstance();

            const availablePurchases = await getAvailablePurchases();

            if (availablePurchases && availablePurchases.length > 0) {
                const activeSubscriptions = availablePurchases.filter(
                    (purchase) => purchase.productId.includes(Platform.OS === 'android' ? 'com.aichatbot' : 'subscription')
                );

                if (activeSubscriptions.length > 0) {
                    console.log('Active subscription found:', activeSubscriptions);
                    // Use activeSubscriptions[0].productId or handle other subscription details here
                } else {
                    console.log('No active subscriptions found');
                    await databaseInstance.ref(`subscriptions/${session.user}`).update({
                        status: null,
                        startDate: null,
                        lastRenewalDate: null,
                        transaction: null,
                        productIdentifier: null,
                    }).then(() => {

                    }).catch((e) => {
                        console.log(e)
                    })
                }
            } else {
                console.log('No purchases available to restore');
                await databaseInstance.ref(`subscriptions/${session.user}`).update({
                    status: null,
                    startDate: null,
                    lastRenewalDate: null,
                    transaction: null,
                    productIdentifier: null,
                }).then(() => {

                }).catch((e) => {
                    console.log(e)
                })

            }
        } catch (error) {
            console.error('Error checking for active subscriptions:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: themeColors.black }}>
            <NavigationContainer>

                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                    initialRouteName={!onboarded ? 'onboarding-entry' : 'home-entry'}
                >
                    <Stack.Screen
                        name={'onboarding-entry'}
                        component={OnboardingStack} />
                    <Stack.Screen
                        name={'home-entry'}
                        component={HomeStack} />

                    <Stack.Screen
                        name={'subsPlans'}
                        component={Subscription}
                        options={{
                            headerShown: false
                        }}
                    />

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