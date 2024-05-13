import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { IDefaultProps } from "../../../utils/types.ts";
import ChatInput from "../../../components/fields/chat-input/chat-input.tsx";
import database from "@react-native-firebase/database";
import { USER_ROLE } from "../../../utils/roles.ts";
import { formateDateTo12HoursTime } from "../../../utils/formate-date.ts";
import useSession from "../../../hooks/useSession.ts";
import { useNavigation } from "@react-navigation/native";
import useSubscription from "../../../hooks/useSubscription.ts";


interface HomeInputProps extends IDefaultProps {
    iosHeight?: number;
}

const HomeInput: FC<HomeInputProps> = ({ ...props }) => {
    const [session] = useSession();
    const navigation = useNavigation();
    const [subscription, subActions] = useSubscription();

    async function sendMessage(message: string) {
        let refInbox = database().ref(`users/${session?.user}/inbox`);
        let id = refInbox.push().key;
        if (!id) return;
        await refInbox.child(id).set({
            id: id,
            messages: [{
                id: Date.now().toString(),
                text: message,
                role: USER_ROLE,
                createdAt: formateDateTo12HoursTime(new Date()),
                user: session?.user
            }],
        });

        // @ts-ignore
        navigation.navigate("chat", {
            inboxRef: id,
            startGettingResponse: true,
            dontGreetUser: true
        });


    }

    if (!subActions.hasActiveSubscription() && !subActions.hasDailyQuota())
        return <></>

    return (
        <ChatInput
            disabled={false}
            iosHeight={40}
            onSend={(message) => {
                sendMessage(message)
            }}
        />
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        padding: 10,

    }
})


export default HomeInput