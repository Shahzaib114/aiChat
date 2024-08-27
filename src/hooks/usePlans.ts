import {IPlan} from "../utils/types.ts";
import {useEffect, useState} from "react";
import database, {FirebaseDatabaseTypes} from "@react-native-firebase/database";
import { getDatabaseInstance } from "../utils/firebaseInstance.tsx";


export default function usePlans():[IPlan[]] {
    const [plans, setPlans] = useState<IPlan[]>([]);

    function snapshotToArray(snapshot:FirebaseDatabaseTypes.DataSnapshot) {
        const data = snapshot.val();
        let planList: IPlan[] = [];
        for (let key in data) {
            planList.push({
                ...data[key],
                id: key
            })
        }
        setPlans(planList)
    }
    useEffect(() => {
        let ref:any;

        const initializeDatabase = async () => {
            const databaseInstance = await getDatabaseInstance();
            ref = databaseInstance.ref('plans');
            ref.on('value', snapshotToArray);
        };

        initializeDatabase();

        // Cleanup function to remove the listener when the component unmounts
        return () => {
            if (ref) {
                ref.off('value', snapshotToArray);
            }
        };
    }, []);


    return [plans]
}