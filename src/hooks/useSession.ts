import {useContext} from "react";
import SessionContext, {Session} from "../context/session-context.tsx";


function useSession(): [Session] {
    const session = useContext(SessionContext);
    if (!session) {
        throw new Error('useSession must be used within a SessionProvider');
    }

    return [session.session];

}


export default useSession;