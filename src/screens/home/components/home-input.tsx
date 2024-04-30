import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import ChatInput from "../../../components/fields/chat-input/chat-input.tsx";
import database from "@react-native-firebase/database";
import {USER_ROLE} from "../../../utils/roles.ts";
import {formateDateTo12HoursTime} from "../../../utils/formate-date.ts";
import useSession from "../../../hooks/useSession.ts";
import {useNavigation} from "@react-navigation/native";
import useSubscription from "../../../hooks/useSubscription.ts";
import UpgradeToPremiumToast from "../../history/chat/component/upgrade-to-premium-toast/upgrade-to-premium-toast.tsx";


interface HomeInputProps extends IDefaultProps {

}

const HomeInput: FC<HomeInputProps> = ({...props}) => {
    const [session] = useSession();
    const navigation = useNavigation();
    const [subscription, subActions] = useSubscription();

    function sendMessage(message: string) {
        let refInbox = database().ref(`users/${session?.user}/inbox`);
        let id = refInbox.push().key;
        if (!id) return;
        refInbox.child(id).set({
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
        });


    }

    if (!subActions.hasActiveSubscription() && !subActions.hasDailyQuota())
        return <></>

    return (
        <View
            style={styles.container}
        >

            <ChatInput
                disabled={false}
                onSend={(message) => {
                    sendMessage(message)
                }}
            />

        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        padding: 10,

    }
})


export default HomeInput