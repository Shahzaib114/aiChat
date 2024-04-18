import React from 'react';
import {StyleSheet} from "react-native";


export interface IDefaultProps {
    children?: React.ReactNode;
    style?: any

}


export  interface IMessage {
    id: string;
    text: string;
    createdAt: Date;
    user: string;
}
