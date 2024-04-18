import React, {FC, useEffect, useRef} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import {useNavigation} from "@react-navigation/native";
import themeColors from "../../../theme/colors.ts";
import ChatScreenHeader from "./component/chat-screen-header.tsx";
import ChatInput from "../../../components/fields/chat-input/chat-input.tsx";
import Tabs from "../../../components/tabs/tabs.tsx";
import SvgImport from "../../../utils/import-svg.tsx";
import crown from "../../../../assets/svgs/crown.js";
import NotificationBar from "./component/notification-bar/notification-bar.tsx";
import SuggestionComponent from "./component/suggestion/suggestion.tsx";
import Sugesstions from "./component/suggestion/sugesstions.ts";
import SentMessage from "./component/messages/sent-message.tsx";
import message, {DummyMessages} from "./component/messages/variables/messages.ts";
import ReceivedMessage from "./component/messages/received-message.tsx";


interface ChatScreenProps extends IDefaultProps {

}

const ChatScreen: FC<ChatScreenProps> = ({...props}) => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
        return () => navigation.getParent()?.setOptions({
            tabBarStyle: {
                height: 60,
                backgroundColor: themeColors.black,
                borderTopWidth: 0,
            }
        });

    }, [navigation]);

    const user = "user1"

    return (
        <View style={styles.container}>
            <View style={{width: "100%"}}>
                <ChatScreenHeader/>
                <NotificationBar
                    message={"25 daily Messages Remaining in free trial."}
                    variant={"info"}
                />
                <View style={{
                    width: "100%",
                    paddingVertical: 10,
                    paddingHorizontal: 40,

                }}>
                    <Tabs items={[
                        {
                            label: "Chat GPT 3",
                            value: "chat-gpt 3"
                        }, {
                            label: "Chat GPT 4",
                            value: "chat-gpt 4",
                            Icon: <SvgImport svg={crown}/>
                        }
                    ]}/>
                </View>
            </View>
            <FlatList
                ListHeaderComponent={<SuggestionComponent suggestions={Sugesstions}/>}

                contentContainerStyle={{
                    paddingHorizontal: 10,
                    gap: 30,
                }}
                data={DummyMessages}
                renderItem={({item, index}) => {
                    if (item.user === user) {
                        return (
                            <SentMessage
                                {
                                    ...item
                                }
                            />
                        )
                    } else {
                        return (
                            <ReceivedMessage
                                {
                                    ...item
                                }
                            />
                        )
                    }

                }}
                style={{width: "100%"}}
            />
            <View style={{
                width: "100%",
                paddingVertical: 10,
                paddingHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <ChatInput/>
            </View>
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: themeColors.black,
    }
})


export default ChatScreen