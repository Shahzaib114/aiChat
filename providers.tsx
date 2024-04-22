import {IDefaultProps} from "./src/utils/types.ts";
import {SessionProvider} from "./src/context/session-context.tsx";
import {SubscriptionProvider} from "./src/context/subscription-context.tsx";


export default function Providers({children}: IDefaultProps) {
    return (
        <SessionProvider>
            <SubscriptionProvider>
                {children}
            </SubscriptionProvider>
        </SessionProvider>
    )
}