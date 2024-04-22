import {IChat, IGptMessage, IMessage} from "./types.ts";
import {USER_ROLE} from "./roles.ts";


export function IMessageToGptMessages(chats: IMessage[]): IGptMessage[] {
    let messages: IGptMessage[] = chats.map((chat) => {
        return {
            role: chat?.role || USER_ROLE,
            content: chat.text
        }
    })
    return messages
}