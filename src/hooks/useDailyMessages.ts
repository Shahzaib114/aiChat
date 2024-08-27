import { useEffect, useRef, useState } from "react";
import useSession from "./useSession";
import moment from "moment";
import { FREE_DAIL_MESSAGE_LIMIT } from "../utils/app-config";
import getUniqueDeviceId from "../utils/device-id";
import { getDatabaseInstance } from "../utils/firebaseInstance";

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
        const initializeDatabase = async () => {
            const databaseInstance = await getDatabaseInstance();
            const deviceId = await getUniqueDeviceId();

            databaseRef.current = databaseInstance.ref(`/users/${deviceId}/dailyMessages`);
            databaseRef.current.child(moment().format("YYYY-MM-DD")).on('value', firebaseSnapshot);
        };

        initializeDatabase();

        return () => {
            if (databaseRef.current) {
                databaseRef.current.child(moment().format("YYYY-MM-DD")).off('value', firebaseSnapshot);
            }
        };
    }, [session]); // Add session as a dependency if it might change

    const actions: IDailyMessageActions = {
        increment: () => {
            const newCount = todayMessages + 1;
            setTodayMessages(newCount);
            if (databaseRef.current) {
                databaseRef.current.child(moment().format("YYYY-MM-DD")).set({
                    messages: newCount,
                });
            }
        },
        decrement: () => {
            const newCount = todayMessages > 0 ? todayMessages - 1 : 0;
            setTodayMessages(newCount);
            if (databaseRef.current) {
                databaseRef.current.child(moment().format("YYYY-MM-DD")).set({
                    messages: newCount,
                });
            }
        },
        reset: () => {
            setTodayMessages(0);
            if (databaseRef.current) {
                databaseRef.current.child(moment().format("YYYY-MM-DD")).set({
                    messages: 0,
                });
            }
        },
        custom: (value: number) => {
            setTodayMessages(value);
            if (databaseRef.current) {
                databaseRef.current.child(moment().format("YYYY-MM-DD")).set({
                    messages: value,
                });
            }
        }
    };

    return [todayMessages, actions];
}
