import React, { FC } from "react";
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { prompt, TransFormedCategory } from "../variables/types.ts";
import { IDefaultProps } from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";
import { useNavigation } from "@react-navigation/native";
import useSession from "../../../hooks/useSession.ts";
import useSubscription from "../../../hooks/useSubscription.ts";
import BuySubscriptionPopup from "../../../modal/buy-subscription-popup/buy-subscription-popup.tsx";
import { FREE_DAIL_MESSAGE_LIMIT } from "../../../utils/app-config.ts";
import { getDatabaseInstance } from "../../../utils/firebaseInstance.tsx";

interface TopicCardProps extends IDefaultProps, prompt {
    variant?: "grid" | "list",
    onPress?: () => void
}

const TopicCard: FC<TopicCardProps> = ({ ...props }) => {
    const size = Dimensions.get('window').width * 0.4;
    return (
        <Pressable
            onPress={props.onPress}

            style={{
                backgroundColor: props.backgroundColor,
                width: props.variant !== "grid" ? size : null,
                flex: props.variant === "grid" ? 1 : null,
                height: Dimensions.get('window').width * 0.4,
                gap: 10,
                borderRadius: 25,
                paddingHorizontal: 10,
                paddingVertical: 10,
                justifyContent: "center",
                alignItems: "center",
                ...props.style
            }}>

            <Image
                source={{
                    uri: props.logo
                }}
                style={{
                    width: 40,
                    height: 40,
                    objectFit: "contain"
                }}
            />

            <Text style={{ color: themeColors.white, textAlign: "center", fontSize: 16, fontWeight: "500" }}>
                {props.title}
            </Text>

        </Pressable>
    )

}

interface TopicCardLayoutProps extends TransFormedCategory {
    data: prompt[],
    isSelected?: boolean
}

const TopicCardLayout: FC<TopicCardLayoutProps> = ({ ...props }) => {
    const navigation = useNavigation();
    const [session] = useSession();
    const [sub, subscriptionAction] = useSubscription()
    const buySubscriptionPopup = React.useRef<BuySubscriptionPopup>(null);

    async function onCardClick(promptData: prompt) {
        const databaseInstance = await getDatabaseInstance();

        if (!subscriptionAction.hasActiveSubscription() && !subscriptionAction.hasDailyQuota()) {
            buySubscriptionPopup.current?.showBuySubscription()
            return
        }
        let refInbox = databaseInstance.ref(`users/${session?.user}/inbox`);
        let id = refInbox.push().key;
        if (!id) return;
        await refInbox.child(id).set({
            id: id,
            prompt: promptData,
            messages: [],
        });

        // @ts-ignore
        navigation.navigate("chat", {
            inboxRef: id,
            prompt: promptData,
            startGettingResponse: true
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
            {props.isSelected ? <FlatList data={props.data}
                renderItem={({ item, index }) =>
                    <TopicCard
                        onPress={() => onCardClick(item)}
                        variant={"grid"}
                        style={{

                            marginHorizontal: 5,

                        }}

                        {...item} key={index} />
                }
                columnWrapperStyle={{
                    justifyContent: "center",
                    alignItems: "center",

                }}

                ItemSeparatorComponent={() => <View style={{
                    height: 20,
                }} />}

                numColumns={2}
                showsVerticalScrollIndicator={false}
            /> : <FlatList data={props.data}
                renderItem={({ item, index }) =>
                    <TopicCard
                        onPress={() => onCardClick(item)}
                        {...item} key={index} />
                }
                ItemSeparatorComponent={() => <View style={{
                    width: 20
                }} />}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
            }


        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        gap: 5,
        paddingHorizontal: 10
    },
    text: {
        fontSize: 20,
        paddingBottom: 10,
        fontWeight: "700",
        color: "white",
        textTransform: "capitalize"
    }
})


export default TopicCardLayout