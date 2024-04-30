import React from 'react';
import {StyleSheet} from "react-native";
import {prompt} from "../screens/home/variables/types.ts";


export interface IDefaultProps {
    children?: React.ReactNode;
    style?: any

}


export interface IMessage {
    id: string;
    text: string;
    role?: string;
    createdAt: Date | string;
    user: string;
}


export interface IChat {
    id?: string;
    messages?: IMessage[];
    prompt?: prompt;
}

export interface IPlan {
    duration: string;
    title: string;
    price: number;
    id: string;
    gpt3: boolean;
    gpt4: boolean;
    totalMessages: number;
}

export interface IGptMessage {
    role: string;
    content: string;
}

export interface ISubscription {
    status: "active" | "inactive" | undefined;
    startDate?: number;
    endDate?: number;
    lastRenewalDate?: number;
    subscriptionType?: IPlan,
}

