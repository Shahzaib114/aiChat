import { useContext } from "react";
import SubscriptionContext, {
    ISubscriptionActions
} from "../context/subscription-context.tsx";
import { ISubscription } from "../utils/types.ts";


function useSubscription(): [ISubscription, ISubscriptionActions ] {
    const subscription = useContext(SubscriptionContext);
    if (!subscription) {
        throw new Error('useSession must be used within a SessionProvider');
    }

    return [subscription.subscription, subscription.actions];

}


export default useSubscription;