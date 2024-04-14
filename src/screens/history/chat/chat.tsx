import React, {FC, useEffect, useRef} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import {useNavigation} from "@react-navigation/native";
import themeColors from "../../../theme/colors.ts";
import ChatScreenHeader from "./component/chat-screen-header.tsx";
import ChatInput from "../../../components/fields/chat-input/chat-input.tsx";


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

    return (
        <View style={styles.container}>
            <View style={{width: "100%"}}>
                <ChatScreenHeader/>

            </View>
            <View style={{flex: 1}}>

            </View>
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
        backgroundColor: themeColors.black ,
    }
})


export default ChatScreen