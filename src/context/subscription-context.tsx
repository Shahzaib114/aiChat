
import {createContext, Dispatch, SetStateAction, useEffect, useState} from "react";
import {IDefaultProps, ISubscription} from "../utils/types.ts";
import getUniqueDeviceId from "../utils/device-id.ts";
import database from "@react-native-firebase/database";
import useSession from "../hooks/useSession.ts";

export interface ISubscriptionActions {
    hasActiveSubscription: () => boolean,
    updateSubscription: Dispatch<SetStateAction<ISubscription>>,
    hasDailyQuota: () => boolean
}

export interface subscriptionContextProps {
    subscription: ISubscription,

    actions:ISubscriptionActions
}

const initialSession: ISubscription = {

} as ISubscription

const SessionContext = createContext<subscriptionContextProps>({
    subscription: initialSession,
    actions: {
        hasActiveSubscription: () => false,
        updateSubscription: () => {},
        hasDailyQuota: () => false
    }

});


export function SubscriptionProvider({children}: IDefaultProps) {
    const [subscription, updateSubscription] = useState<ISubscription>(initialSession);
    const [session] = useSession()
    const value: subscriptionContextProps = {
        subscription,
        actions: {
            hasActiveSubscription,
            updateSubscription,
            hasDailyQuota,
        }
    }

    function hasDailyQuota(){
        return true
    }

    function Subscription(snapshot:any) {
        let data:ISubscription = snapshot.val();
        if (data === null){
            data = {
                status: "inactive"
            }
        }
        if (data.status === undefined){
            data.status = "inactive"
        }
        updateSubscription(data)
    }

    function hasActiveSubscription(){
        return subscription.status === "active"
    }



    useEffect(() => {
        database().ref(`subscriptions/${session.user}`).on('value', Subscription)

        return () => {
            database().ref(`subscriptions/${session.user}`).off('value', Subscription)
        }
    }, []);

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}


export default SessionContext;
