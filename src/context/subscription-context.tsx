import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { IDefaultProps, ISubscription } from "../utils/types.ts";
import useSession from "../hooks/useSession.ts";
import useDailyMessages, { IDailyMessageActions } from "../hooks/useDailyMessages.ts";
import { FREE_DAIL_MESSAGE_LIMIT } from "../utils/app-config.ts";
import Purchases from "react-native-purchases";
import { Platform } from "react-native";
import { getDatabaseInstance } from "../utils/firebaseInstance.tsx";

export interface ISubscriptionActions {
    hasActiveSubscription: () => boolean,
    updateSubscription: Dispatch<SetStateAction<ISubscription>>,
    hasDailyQuota: () => boolean,
    getRemainingMessages: () => number,
    todayMessages: number,
    isLoaded: boolean,
    dailyMessagesActions: IDailyMessageActions,
    subscribe: (extra: any) => void
}

export interface subscriptionContextProps {
    subscription: ISubscription,

    actions: ISubscriptionActions
}

const initialSession: ISubscription = {} as ISubscription

const SessionContext = createContext<subscriptionContextProps>({
    subscription: initialSession,

    actions: {
        hasActiveSubscription: () => false,
        updateSubscription: () => {
        },
        todayMessages: 0,
        isLoaded: false,
        dailyMessagesActions: {} as IDailyMessageActions,
        hasDailyQuota: () => false,
        getRemainingMessages: () => 0,
        subscribe: () => {
        }
    }

});


export function SubscriptionProvider({ children }: IDefaultProps) {
    const [subscription, updateSubscription] = useState<ISubscription>(initialSession);
    const [session] = useSession()
    const [todayMessages, dailyMessagesActions] = useDailyMessages();
    const [isLoaded, setIsLoaded] = useState(false);
    const value: subscriptionContextProps = {
        subscription,

        actions: {
            hasActiveSubscription,
            updateSubscription,
            hasDailyQuota,
            getRemainingMessages,
            isLoaded: isLoaded,
            todayMessages: todayMessages,
            dailyMessagesActions: dailyMessagesActions,
            subscribe
        }
    }


    function getRemainingMessages() {
        if (FREE_DAIL_MESSAGE_LIMIT - todayMessages < 0) {
            return 0
        }
        return FREE_DAIL_MESSAGE_LIMIT - todayMessages
    }

    function hasDailyQuota() {
        return getRemainingMessages() > 0
    }

    function Subscription(snapshot: any) {
        let data: ISubscription = snapshot.val();

        if (data === null) {
            data = {
                status: "inactive"
            }
        }
        if (data.status === undefined) {
            data.status = "inactive"
        }
        updateSubscription(data)
        setIsLoaded(true)
    }

    function hasActiveSubscription() {
        return subscription.status === "active"
    }


    useEffect(() => {
        let userRef: any; // To keep a reference to the database ref for cleanup
        const getDatabaseInstanceAsync = async () => {
            // Await the async function to get the instance
            const databaseInstance = await getDatabaseInstance();

            if (session.user && session.user.trim() !== "") {
                userRef = databaseInstance.ref(`subscriptions/${session.user}`);
                userRef.on('value', Subscription);
            }
        };

        getDatabaseInstanceAsync();

        // Cleanup function
        return () => {
            if (userRef) {
                userRef.off('value', Subscription);
            }
        };
    }, [session.user]);

    async function clearSubscription() {
        const databaseInstance = await getDatabaseInstance();

        await databaseInstance.ref(`subscriptions/${session.user}`).update({
            status: "inactive"
        })

    }

    async function checkForSubscription() {
        // let res = await Purchases.getCustomerInfo()
        // console.log('res', res)
        // if (res?.entitlements?.active) {
        //     await clearSubscription()
        // } else {
        //     subscribe(res)
        // }

    }

    useEffect(() => {
        checkForSubscription()
    }, []);


    async function subscribe(extra: any) {
        let Plan: any;
        let groupid: any;
        const databaseInstance = await getDatabaseInstance();

        if (Platform.OS === 'android') {
            Plan = extra?.subscriber?.subscriptions?.["com.aichatbot"]
            groupid = Plan.product_plan_identifier
        } else {
            if (extra?.subscriber?.subscriptions?.[extra?.selectedPackage]) {
                Plan = extra?.subscriber?.subscriptions?.[extra?.selectedPackage]
                groupid = Plan.product_plan_identifier
            }
        }
        await databaseInstance.ref(`subscriptions/${session.user}`).set({
            status: "active",
            startDate: new Date().getTime(),
            lastRenewalDate: new Date().getTime(),
            transaction: {
                productIdentifier: Platform.OS === 'android' ? Plan.product_plan_identifier : extra?.selectedPackage,
                purchaseDate: Plan?.purchase_date,
                transactionId: Platform.OS === 'android' ? extra?.subscriber?.subscriptions?.[groupid]?.store_transaction_id : Plan?.store_transaction_id,
            },
            productIdentifier: Platform.OS === 'android' ? Plan.product_plan_identifier : extra?.selectedPackage,
        } as ISubscription).then(() => {
            // Toast.show("Subscription successful", Toast.SHORT)
        }).catch((e) => {
            console.log(e)
        })
        // Toast.show("Subscription successful", Toast.SHORT)

    }

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}


export default SessionContext;
