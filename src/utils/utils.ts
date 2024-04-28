import {IChat, IGptMessage, IMessage} from "./types.ts";
import {USER_ROLE} from "./roles.ts";
import mime from "mime";

export function IMessageToGptMessages(chats: IMessage[]): IGptMessage[] {
    let messages: IGptMessage[] = chats.map((chat) => {
        return {
            role: chat?.role || USER_ROLE,
            content: chat.text
        }
    })
    return messages
}

export const getUrl = (uri:string) => {
    let file = {
        uri: uri,
        name: uri.split("/").pop(),
        type: mime.getType(uri)
    }
    return file
}