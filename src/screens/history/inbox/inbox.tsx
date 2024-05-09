import React, {FC} from "react";
import {FlatList, Pressable, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";
import InBoxHeader from "./components/inbox-header.tsx";
import dummyData from "./variables/dummy-data.ts";
import InBoxItem, {InBoxItemProps} from "./components/ibox-chat-item.tsx";
import {useInBox} from "../../../hooks/useInBox.ts";
import {useNavigation} from "@react-navigation/native";
import BuySubscriptionPopup from "../../../modal/buy-subscription-popup/buy-subscription-popup.tsx";
import {FREE_DAIL_MESSAGE_LIMIT} from "../../../utils/app-config.ts";
import useSubscription from "../../../hooks/useSubscription.ts";


interface InBoxProps extends IDefaultProps {

}

const InBox: FC<InBoxProps> = ({...props}) => {
    const [inboxData, actions] = useInBox();
    const navigation = useNavigation();
    const [sub, subscriptionAction] = useSubscription()
    const buySubscriptionPopup = React.useRef<BuySubscriptionPopup>(null);

    function onItemClick(item: InBoxItemProps) {
        if (!subscriptionAction.hasActiveSubscription() && !subscriptionAction.hasDailyQuota()) {
            buySubscriptionPopup.current?.showBuySubscription()
            return
        }
        // @ts-ignore
        navigation.navigate("chat", {
            inboxRef: item.inboxRef,
            dontGreetUser: true
        });


    }


    return (
        <SafeAreaView style={styles.container}>
            <BuySubscriptionPopup
                onWatch={() => {
                    subscriptionAction?.dailyMessagesActions?.custom?.(FREE_DAIL_MESSAGE_LIMIT - 1)
                    console.log("watched")
                }}
                ref={buySubscriptionPopup}
            />
            <View style={{width: "100%"}}>
                <InBoxHeader
                    onClearChats={() => {
                        actions.clearAllChat()
                    }}
                />
            </View>
            <FlatList data={inboxData}
                      renderItem={
                          ({item, index}) => <InBoxItem
                              onPress={() => {
                                  onItemClick(item)
                              }}
                              onPressDelete={() => {
                                  if (item.inboxRef)
                                      actions.deleteInbox(item.inboxRef)

                              }}
                              key={index} title={item.title}
                              totalMessages={item.totalMessages} time={item.time}/>
                      }
                      style={{width: "100%"}}
                      ListFooterComponent={() => (
                          <View style={{
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              marginTop: 20,

                          }}>

                              <Pressable
                                  onPress={() => {
                                      if (!subscriptionAction.hasActiveSubscription() && !subscriptionAction.hasDailyQuota()) {
                                          buySubscriptionPopup.current?.showBuySubscription()
                                          return
                                      }
                                      actions.newChat(navigation)
                                  }}
                                  style={styles.button}>
                                  <Text style={styles.text}>+ New Chat</Text>
                              </Pressable>
                          </View>
                      )}
            />


        </SafeAreaView>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        backgroundColor: themeColors.black,
        flex: 1,
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
    },
    button: {
        backgroundColor: themeColors.primary,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 1000,
        width: 200,
    },
    text: {
        fontFamily: "Manrope",
        color: themeColors.white,
        fontSize: 18,
        fontWeight: "500",
    }
})


export default InBox