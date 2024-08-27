import { useEffect, useState } from "react";
import { category } from "../screens/home/variables/types";
import { getDatabaseInstance } from "../utils/firebaseInstance";

function useCategories(): [category, boolean] {
    const [data, setData] = useState<category>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const databaseInstance = await getDatabaseInstance();

                if (databaseInstance) {
                    const userRef = databaseInstance.ref('category');
                    
                    const FireBaseSnapshot = (value: any) => {
                        setData(value.val());
                        setLoading(false);
                    };

                    userRef.on('value', FireBaseSnapshot);

                    // Cleanup function
                    return () => {
                        userRef.off('value', FireBaseSnapshot);
                    };
                } else {
                    // Handle the case where databaseInstance is not available
                    console.error("Firebase database instance not available");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching database instance:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return [data, loading];
}

export default useCategories;
