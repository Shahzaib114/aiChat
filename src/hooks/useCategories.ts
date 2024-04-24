import {useEffect, useState} from "react";
import {category} from "../screens/home/variables/types.ts";
import database, {FirebaseDatabaseTypes} from "@react-native-firebase/database";


function useCategories(): [category, boolean] {
    const [data, setData] = useState<category>({});
    const [loading, setLoading] = useState<boolean>(true);


    function FireBaseSnapshot(value: any) {
        setData(value.val());
        setLoading(false);
        // console.log(value.val());
    }

    useEffect(() => {
        setLoading(true)
        const userRef = database().ref('category');
        userRef.on('value', FireBaseSnapshot);

        return () => {
            userRef.off('value', FireBaseSnapshot);
        }
    }, []);

    return [data, loading]
}

export default useCategories;