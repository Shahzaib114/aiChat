import {IPlan} from "../utils/types.ts";
import {useEffect, useState} from "react";
import database, {FirebaseDatabaseTypes} from "@react-native-firebase/database";


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
        database().ref('plans').on('value', snapshotToArray)


        return () => {
            database().ref('plans').off('value', snapshotToArray)
        }

    }, []);


    console.log("PLANS: ", plans)

    return [plans]
}