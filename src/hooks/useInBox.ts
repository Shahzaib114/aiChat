import { InBoxItemProps } from "../screens/history/inbox/components/ibox-chat-item.tsx";
import { useEffect, useState } from "react";
import useSession from "./useSession.ts";
import { IChat } from "../utils/types.ts";
import { formateDateTo12HoursTime } from "../utils/formate-date.ts";
import { getDatabaseInstance } from "../utils/firebaseInstance.tsx";


interface IActions {
    deleteInbox: (inboxRef: string) => void;
    clearAllChat: () => void;
    newChat: (navigation: any) => void;
}

export function useInBox(): [InBoxItemProps[], IActions] {
    const [inbox, setInBox] = useState<InBoxItemProps[]>([]);
    const [session] = useSession();

    function mySnapshot(snapshot: any) {
        const data = snapshot.val();
        const inboxData: InBoxItemProps[] = [];

        for (const key in data) {
            const item: IChat = data[key];
            let myTitle = item.prompt?.title ? item.prompt.title : item?.messages?.[0]?.text ? item.messages[0].text : "";
            if (myTitle.length === 0) {
                continue
            }
            if (!item?.messages) {
                continue;
            }
            let time = item.messages?.[item.messages.length - 1]?.createdAt || "";
            if (typeof time !== "string") {
                time = formateDateTo12HoursTime(time)
            }
            inboxData.push({
                tid: item.messages?.[item.messages.length - 1]?.id || "",
                title: myTitle,
                totalMessages: item.messages?.length || 0,
                time: time,
                inboxRef: key
            })
        }
        // sort by id
        inboxData.sort((a, b) => {
            if (!a?.tid || !b?.tid) return 0;
            return parseInt(b?.tid) - parseInt(a?.tid)
        })

        setInBox(inboxData);

    }

    async function deleteInbox(inboxRef: string) {
        const databaseInstance = await getDatabaseInstance();
        return databaseInstance.ref(`users/${session?.user}/inbox/${inboxRef}`).remove();
    }

    async function clearAllChat() {
        const databaseInstance = await getDatabaseInstance();
        return databaseInstance.ref(`users/${session?.user}/inbox`).remove();
    }

    async function newChat(navigation: any) {
        const databaseInstance = await getDatabaseInstance();
        let refInbox = databaseInstance.ref(`users/${session?.user}/inbox`);
        let id = refInbox.push().key;
        if (!id) return;
        refInbox.child(id).set({
            id: id,
            prompt: undefined,
            messages: [],
        });

        // @ts-ignore
        navigation.navigate("chat", {
            inboxRef: id,
            startGettingResponse: true,
        });


    }

    useEffect(() => {
        let ref:any;

        const initializeFirebase = async () => {
            const databaseInstance = await getDatabaseInstance();
            ref = databaseInstance.ref(`users/${session?.user}/inbox`);
            ref.on('value', mySnapshot);
        };

        initializeFirebase();

        // Cleanup function
        return () => {
            if (ref) {
                ref.off('value', mySnapshot);
            }
        };
    }, [session.user]);

    const actions: IActions = {
        deleteInbox: deleteInbox,
        clearAllChat: clearAllChat,
        newChat: newChat
    }


    return [inbox, actions];
}