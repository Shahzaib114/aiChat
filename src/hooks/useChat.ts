import {IChat, IMessage} from "../utils/types.ts";
import {useEffect, useRef, useState} from "react";
import database from "@react-native-firebase/database";
import useSession from "./useSession.ts";
import {formateDateTo12HoursTime} from "../utils/formate-date.ts";
import {SYSTEM_ROLE, USER_ROLE} from "../utils/roles.ts";

interface IActions {
    sendMessage: (message: string) => void;
    addGptMessage: (message: string) => void;
}

export default function useChat(inboxRef: string): [IChat, IActions] {
    const [chat, setChat] = useState<IChat>({} as IChat);
    const [session] = useSession();
    const ref = useRef(database().ref(`users/${session?.user}/inbox/${inboxRef}`));
    const oldRef = useRef(inboxRef);


    function addMessage(message: string, role: "user" | "system", user: string) {
        let messages: IMessage[] = chat.messages || [];
        ref.current.update({
            messages: [
                ...messages,
                {
                    id: Date.now().toString(),
                    text: message,
                    role: role,
                    createdAt: formateDateTo12HoursTime(new Date()),
                    user: user
                },
            ]
        });
    }

    function sendMessage(message: string) {
        addMessage(message, USER_ROLE, session?.user);
    }

    function addGptMessage(message: string) {
        addMessage(message, SYSTEM_ROLE, SYSTEM_ROLE);
    }


    const actions: IActions = {
        sendMessage: sendMessage,
        addGptMessage: addGptMessage,
    }

    function snapShotToChat(snapshot: any) {
        const data = snapshot.val();
        if (data) {
            setChat(data);
        }
    }

    useEffect(() => {
        // setChat({} as IChat)
        if (inboxRef !== oldRef.current) {
            ref.current.off('value', snapShotToChat);
            ref.current = database().ref(`users/${session?.user}/inbox/${inboxRef}`);
            oldRef.current = inboxRef;

        }

        ref.current.on('value', snapShotToChat);
        return () => {
            ref.current.off('value', snapShotToChat);
        };
    }, [inboxRef]);


    return [chat, actions];
}