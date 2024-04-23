import {useEffect, useRef, useState} from "react";
import useSession from "./useSession.ts";
import database from "@react-native-firebase/database";
import moment from "moment";
import {FREE_DAIL_MESSAGE_LIMIT} from "../utils/app-config.ts";
import getUniqueDeviceId from "../utils/device-id.ts";

export interface IDailyMessageActions {
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    custom: (value: number) => void;

}

export default function useDailyMessages(): [number, IDailyMessageActions] {
    const [todayMessages, setTodayMessages] = useState<number>(0);
    const [session] = useSession();
    const databaseRef = useRef<any>(null);

    function firebaseSnapshot(snapshot: any) {
        if (!snapshot.exists()) {
            setTodayMessages(0);
            actions.reset();
            return;
        }
        setTodayMessages(snapshot.val()?.messages || 0);
    }

    useEffect(() => {
        let deviceId = getUniqueDeviceId().then((deviceId) => {
            databaseRef.current = database().ref(`/users/${deviceId}/dailyMessages`);
            databaseRef.current.child(moment().format("YYYY-MM-DD")).on('value', firebaseSnapshot);
        });
        return () => {
            databaseRef.current.child(moment().format("YYYY-MM-DD")).off('value', firebaseSnapshot);
        }
    }, []);

    const actions: IDailyMessageActions = {
        increment: () => {
            setTodayMessages(todayMessages + 1);
            databaseRef.current.child(moment().format("YYYY-MM-DD")).set({
                messages: todayMessages + 1,
            });
        },
        decrement: () => {
            setTodayMessages(todayMessages - 1);
            databaseRef.current.child(moment().format("YYYY-MM-DD")).set({
                messages: todayMessages - 1,
            });
        },
        reset: () => {
            setTodayMessages(0);
            databaseRef.current.child(moment().format("YYYY-MM-DD")).set({
                messages: 0,
            });
        },
        custom: (value: number) => {
            setTodayMessages(value);
            databaseRef.current.child(moment().format("YYYY-MM-DD")).set({
                messages: value,
            });
        }
    }


    return [todayMessages, actions];

}