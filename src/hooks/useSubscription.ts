import {useContext} from "react";
import SessionContext, {Session} from "../context/session-context.tsx";
import SubscriptionContext, {
    ISubscriptionActions,
    subscriptionContextProps,
    SubscriptionProvider
} from "../context/subscription-context.tsx";
import {ISubscription} from "../utils/types.ts";


function useSubscription(): [ISubscription, ISubscriptionActions ] {
    const subscription = useContext(SubscriptionContext);
    if (!subscription) {
        throw new Error('useSession must be used within a SessionProvider');
    }

    return [subscription.subscription, subscription.actions];

}


export default useSubscription;