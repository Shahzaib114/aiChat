import {createContext, Dispatch, SetStateAction, useEffect, useState} from "react";
import {IDefaultProps} from "../utils/types.ts";
import getUniqueDeviceId from "../utils/device-id.ts";

export interface Session {
    user: string

}

export interface SessionContextProps {
    session: Session,
    updateSession: Dispatch<SetStateAction<Session>>
}

const initialSession: Session = {
    user: ""
}

const SessionContext = createContext<SessionContextProps>({
    session: initialSession,
    updateSession: () => {
    }
});


export function SessionProvider({children}: IDefaultProps) {
    const [session, updateSession] = useState<Session>(initialSession);

    const value: SessionContextProps = {
        session,
        updateSession
    }
    useEffect(() => {
        async function getUser() {
            await getUniqueDeviceId().then((id) => {
                updateSession((old) => {
                    return {
                        ...old,
                        user: id
                    }
                })
            })
        }
        getUser()
        return () => {

        }
    }, []);

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}


export default SessionContext;
