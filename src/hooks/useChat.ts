import { IChat, IMessage } from "../utils/types";
import { useEffect, useRef, useState } from "react";
import useSession from "./useSession";
import { formateDateTo12HoursTime } from "../utils/formate-date";
import { SYSTEM_ROLE, USER_ROLE } from "../utils/roles";
import { getDatabaseInstance } from "../utils/firebaseInstance";
import { FirebaseDatabaseTypes } from "@react-native-firebase/database";

interface IActions {
    sendMessage: (message: string) => void;
    addGptMessage: (message: string) => void;
    getMessagesWithGreeting: () => IMessage[];
    retryMessage: () => void;
}

export default function useChat(inboxRef: string): [IChat, IActions] {
    const [chat, setChat] = useState<IChat>({} as IChat);
    const [session] = useSession();
    const ref = useRef<FirebaseDatabaseTypes.Reference | null>(null);
    const oldRef = useRef(inboxRef);
    const [isLoadingFirstTime, setIsLoadingFirstTime] = useState<boolean>(true);

    useEffect(() => {
        const getRef = async () => {
            const databaseInstance = await getDatabaseInstance();
            ref.current = databaseInstance.ref(`users/${session?.user}/inbox/${inboxRef}`);

            ref.current.on('value', snapShotToChat);
        };

        getRef();

        return () => {
            if (ref.current) {
                ref.current.off('value', snapShotToChat);
            }
        };
    }, [session?.user, inboxRef]);

    function addMessage(message: string, role: "user" | "system", user: string) {
        const messages: IMessage[] = chat.messages || [];
        if (ref.current) {
            ref.current.update({
                messages: [
                    ...messages,
                    {
                        id: Date.now().toString(),
                        text: message,
                        role: role,
                        createdAt: formateDateTo12HoursTime(new Date()),
                        user: user,
                    },
                ],
            });
        }
    }

    function sendMessage(message: string) {
        addMessage(message, USER_ROLE, session?.user);
    }

    function addGptMessage(message: string) {
        addMessage(message, SYSTEM_ROLE, SYSTEM_ROLE);
    }

    function getMessagesWithGreeting(): IMessage[] {
        const messages: IMessage[] = chat.messages || [];
        const lastMessage = messages?.[0];
        if (lastMessage?.role === SYSTEM_ROLE) {
            return messages;
        }
        return messages;
    }

    async function retryMessage() {
        let messages: IMessage[] = chat.messages || [];
        messages = messages.slice(0, messages.length - 1);
        if (ref.current) {
            await ref.current.update({
                messages: messages,
            });
        }
    }

    const actions: IActions = {
        sendMessage,
        addGptMessage,
        getMessagesWithGreeting,
        retryMessage,
    };

    function snapShotToChat(snapshot: FirebaseDatabaseTypes.DataSnapshot) {
        const data = snapshot.val();
        if (data) {
            setChat(data);
        }
    }

    useEffect(() => {
        async function initializeRef() {
            const databaseInstance = await getDatabaseInstance();

            if (inboxRef !== oldRef.current) {
                if (ref.current) {
                    ref.current.off('value', snapShotToChat);
                }
                ref.current = databaseInstance.ref(`users/${session?.user}/inbox/${inboxRef}`);
                oldRef.current = inboxRef;
            }

            if (ref.current) {
                ref.current.on('value', snapShotToChat);
            }
        }

        initializeRef();

        return () => {
            if (ref.current) {
                ref.current.off('value', snapShotToChat);
            }
        };
    }, [inboxRef, session?.user]);

    return [chat, actions];
}
