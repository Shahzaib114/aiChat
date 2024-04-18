import {IMessage} from "../../../../../../utils/types.ts";


const message:IMessage = {
    id: "1",
    text: "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    createdAt: new Date(),

    user: "1"
}


const DummyMessages: IMessage[] = [
    {
        id: "1",
        text: "Hello, how are you?",
        createdAt: new Date(),
        user: "user1"
    },
    {
        id: "2",
        text: "Hey there!",
        createdAt: new Date(),
        user: "user2"
    },
    {
        id: "3",
        text: "I'm doing well, thank you!",
        createdAt: new Date(),
        user: "user1"
    },
    {
        id: "4",
        text: "Not much, just relaxing.",
        createdAt: new Date(),
        user: "user2"
    },
    {
        id: "5",
        text: "What have you been up to?",
        createdAt: new Date(),
        user: "user1"
    },
    {
        id: "6",
        text: "Do you want to hang out later?",
        createdAt: new Date(),
        user: "user2"
    }
];

export {DummyMessages};
export default message;