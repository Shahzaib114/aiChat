import { IGptMessage, IMessage } from "./types.ts";
import { USER_ROLE } from "./roles.ts";
import mime from "mime";
import { Platform, Share, Clipboard } from "react-native";
import { ANDROID_PACKAGE_NAME, IOS_APP_ID } from "./app-config.ts";
import Toast from 'react-native-simple-toast';
import Tts from "react-native-tts";

export function IMessageToGptMessages(chats: IMessage[]): IGptMessage[] {
    let messages: IGptMessage[] = chats.map((chat) => {
        return {
            role: chat?.role || USER_ROLE,
            content: chat.text
        }
    })
    return messages
}


export function getAppShareLink(): string {
    if (Platform.OS === 'android') {
        return 'https://play.google.com/store/apps/details?id=' + ANDROID_PACKAGE_NAME;
    } else if (Platform.OS === 'ios') {
        return 'https://apps.apple.com/us/app/' + IOS_APP_ID;
    }
    return '';
}

export const getUrl = (uri: string) => {
    let file = {
        uri: uri,
        name: uri.split("/").pop(),
        type: mime.getType(uri)
    }
    return file
}


export const shareText = async (txt: string) => {
    try {
        const result = await Share.share({
            message: txt,
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
                console.log("ACTIVITY TYPE: ", result.activityType);
            } else {
                // shared
                console.log("SHARED");
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
            console.log("DISMISSED");
        }
    } catch (error) {

    }
};

export const CopyToClipboard = async (txt: string) => {
    try {
        Clipboard.setString(txt);
        Toast.showWithGravity(
            "Copied to clipboard",
            Toast.LONG,
            Toast.BOTTOM
        );

    } catch (error) {
    }
}


export function TextToSpeech(text: string) {
    if (Tts.voices.length == 0) {
        Tts.speak(text);
    }

}