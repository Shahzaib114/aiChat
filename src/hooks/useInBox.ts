import {InBoxItemProps} from "../screens/history/inbox/components/ibox-chat-item.tsx";
import {useEffect, useState} from "react";
import useSession from "./useSession.ts";
import database from "@react-native-firebase/database";
import {IChat} from "../utils/types.ts";
import {formateDateTo12HoursTime} from "../utils/formate-date.ts";


export function useInBox(): [InBoxItemProps[]] {
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
                title: myTitle,
                totalMessages: item.messages?.length || 0,
                time: time,
                inboxRef: key
            })
        }

        setInBox(inboxData);

    }

    useEffect(() => {
            const ref = database().ref(`users/${session?.user}/inbox`);
            ref.on('value', mySnapshot);

            return () => {
                ref.off('value', mySnapshot);
            }
        }
        , [])


    return [inbox];
}