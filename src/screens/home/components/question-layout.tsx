import React, { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TransFormedCategory } from "../variables/types.ts";
import themeColors from "../../../theme/colors.ts";
import useSession from "../../../hooks/useSession.ts";
import { formateDateTo12HoursTime } from "../../../utils/formate-date.ts";
import { USER_ROLE } from "../../../utils/roles.ts";
import { useNavigation } from "@react-navigation/native";
import useSubscription from "../../../hooks/useSubscription.ts";
import BuySubscriptionPopup from "../../../modal/buy-subscription-popup/buy-subscription-popup.tsx";
import { FREE_DAIL_MESSAGE_LIMIT } from "../../../utils/app-config.ts";
import { getDatabaseInstance } from "../../../utils/firebaseInstance.tsx";


interface QuestionLayoutProps extends TransFormedCategory {
    data: string[]
}

const QuestionLayout: FC<QuestionLayoutProps> = ({...props}) => {
    const [session] = useSession();
    const navigation = useNavigation();
    const [sub, subscriptionAction] = useSubscription()
    const buySubscriptionPopup = React.useRef<BuySubscriptionPopup>(null);

   async function onQuestionClick(question: string) {
    const databaseInstance = await getDatabaseInstance();
        if (!subscriptionAction.hasActiveSubscription() && !subscriptionAction.hasDailyQuota()) {
            buySubscriptionPopup.current?.showBuySubscription()
            return
        }
        let refInbox = databaseInstance.ref(`users/${session?.user}/inbox`);
        let id = refInbox.push().key;
        if (!id) return;
        refInbox.child(id).set({
            id: id,
            messages: [{
                id: Date.now().toString(),
                text: question,
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

    return (
        <View style={styles.container}>
            <BuySubscriptionPopup
                onWatch={() => {
                    subscriptionAction?.dailyMessagesActions?.custom?.(FREE_DAIL_MESSAGE_LIMIT - 1)
                    console.log("watched")
                }}
                ref={buySubscriptionPopup}
            />
            <Text style={styles.text}>{props.title}</Text>
            {
                props.data.map((item, index) => {
                    return (
                        <Pressable
                            key={index}
                            onPress={() => onQuestionClick(item)}
                        >
                            <Text
                                style={
                                    styles.text2
                                }
                            >{index + 1}. {item}</Text>
                        </Pressable>
                    )


                })
            }
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        gap: 5,
        paddingHorizontal: 20
    },
    text: {
        fontSize: 20,
        paddingBottom: 10,
        fontWeight: "700",
        color: "white",
        textTransform: "capitalize"
    },
    text2: {
        color: "white",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginTop: 10,
        paddingVertical: 15,
        backgroundColor: themeColors.blackLight,
    }
})


export default QuestionLayout