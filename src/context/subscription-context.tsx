import {createContext, Dispatch, SetStateAction, useEffect, useState} from "react";
import {IDefaultProps, ISubscription} from "../utils/types.ts";
import getUniqueDeviceId from "../utils/device-id.ts";
import database from "@react-native-firebase/database";
import useSession from "../hooks/useSession.ts";
import useDailyMessages, {IDailyMessageActions} from "../hooks/useDailyMessages.ts";
import {FREE_DAIL_MESSAGE_LIMIT} from "../utils/app-config.ts";
import Toast from "react-native-simple-toast";

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


export function SubscriptionProvider({children}: IDefaultProps) {
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
        if (!session.user || session.user.trim() === "") {
            return
        }
        database().ref(`subscriptions/${session.user}`).on('value', Subscription)

        return () => {
            database().ref(`subscriptions/${session.user}`).off('value', Subscription)
        }
    }, [session.user]);

    async function subscribe(extra: any) {
        await database().ref(`subscriptions/${session.user}`).set({
            status: "active",
            startDate: new Date().getTime(),
            lastRenewalDate: new Date().getTime(),
            transaction: extra?.transaction,
            productIdentifier: extra?.productIdentifier,
        } as ISubscription).then(() => {
            Toast.show("Subscription successful", Toast.SHORT)
        }).catch((e) => {
            console.log(e)
        })
        Toast.show("Subscription successful", Toast.SHORT)

    }

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}


export default SessionContext;
