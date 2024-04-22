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
import ReceivedMessage from "./component/messages/received-message.tsx";
import useHiddenTabs from "../../../hooks/useHiddenTabs.ts";
import useChat from "../../../hooks/useChat.ts";
import useSession from "../../../hooks/useSession.ts";
import {gptCompletions} from "../../../apis/axios-config.ts";
import {IMessageToGptMessages} from "../../../utils/utils.ts";
import {GPT3} from "../../../utils/gpt-models.ts";
import {ITabsItem} from "../../../components/tabs/types.ts";
import AvailableModels from "./variables/available-models.tsx";
import TypingAnimation from "../../../components/typing-animation/typing-animation.tsx";


interface ChatScreenProps extends IDefaultProps {

}

const ChatScreen: FC<ChatScreenProps> = ({...props}) => {
    useHiddenTabs()
    const [session] = useSession();
    const user = session.user;
    // @ts-ignore
    const inboxRef = props?.route?.params?.inboxRef;
    const [chat, actions] = useChat(inboxRef);
    const flatListRef = useRef<FlatList>(null);
    const [startGettingResponse, setStartGettingResponse] = React.useState(false);
    const [gettingResponse, setGettingResponse] = React.useState(false);
    const [gptModel, setGptModel] = React.useState<ITabsItem>(AvailableModels[0]);

    function getResponse() {
        setGettingResponse(true)
        gptCompletions(IMessageToGptMessages(chat.messages || []) || [], gptModel.value).then((response) => {
            actions.addGptMessage(response)
        }).catch(err => {
            console.log(err)
        }).finally(() => {

        })
    }

    useEffect(() => {
        if (chat?.messages)
            flatListRef.current?.scrollToIndex({
                animated: true,
                index: chat.messages.length - 1
            })
        if (chat?.messages && chat?.messages?.length > 0) {
            if (chat.messages[chat.messages.length - 1].user === user && startGettingResponse && !gettingResponse) {
                getResponse()
            }else {
                setGettingResponse(false)
            }
        }

    }, [chat.messages]);


    return (
        <View style={styles.container}>
            <View style={{width: "100%"}}>
                <ChatScreenHeader
                    title={chat?.prompt?.title || "Chat"}
                />
                <NotificationBar
                    message={"25 daily Messages Remaining in free trial."}
                    variant={"info"}
                />
                <View style={{
                    width: "100%",
                    paddingVertical: 10,
                    paddingHorizontal: 40,

                }}>
                    <Tabs
                        selected={gptModel}
                        onChange={(value) => {
                            setGptModel(value)
                        }}
                        items={AvailableModels}/>
                </View>
            </View>
            <FlatList
                ref={flatListRef}
                ListHeaderComponent={<SuggestionComponent suggestions={Sugesstions}/>}
                ListFooterComponent={gettingResponse ? <TypingAnimation/> : <></>}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 50));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({index: info.index});
                    });
                }}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    gap: 30,
                }}
                data={chat.messages || []}
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
                <ChatInput
                    disabled={gettingResponse}
                    onSend={(message) => {
                        actions.sendMessage(message)
                        if (!startGettingResponse)
                            setStartGettingResponse(true);

                    }}
                />
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