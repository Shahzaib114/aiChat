import {InBoxItemProps} from "../screens/history/inbox/components/ibox-chat-item.tsx";
import {useEffect, useState} from "react";
import useSession from "./useSession.ts";
import database from "@react-native-firebase/database";
import {IChat} from "../utils/types.ts";
import {formateDateTo12HoursTime} from "../utils/formate-date.ts";


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

    function deleteInbox(inboxRef: string) {
        return database().ref(`users/${session?.user}/inbox/${inboxRef}`).remove();
    }

    function clearAllChat() {
        return database().ref(`users/${session?.user}/inbox`).remove();
    }

    function newChat(navigation: any) {
        let refInbox = database().ref(`users/${session?.user}/inbox`);
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
            const ref = database().ref(`users/${session?.user}/inbox`);
            ref.on('value', mySnapshot);

            return () => {
                ref.off('value', mySnapshot);
            }
        }
        , [])

    const actions: IActions = {
        deleteInbox: deleteInbox,
        clearAllChat: clearAllChat,
        newChat: newChat
    }


    return [inbox, actions];
}