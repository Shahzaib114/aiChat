import * as React from 'react';
import Root from "./src/screens/root/root.tsx";
import Providers from "./providers.tsx";
import { useEffect, useState } from "react";
import { ON_BOARDING } from "./src/utils/constant.ts";
import AsyncStorage from '@react-native-async-storage/async-storage';


function App() {
    const [onboarded, setOnboarded] = useState<string>("");
    const [isReady, setIsReady] = useState<boolean>(false);
    useEffect(() => {
        getStorage();
    }, []);
    // — — — — — — — — — — ACTIONS — — — — — — — — — — //
    const getStorage = async () => {
        const onboarded = await AsyncStorage.getItem(ON_BOARDING);
        if (onboarded)
            if (onboarded === "true") {
                setOnboarded("true");
            }
        setIsReady(true)
    };
    return (
        <Providers>
            {isReady && <Root onboarded={onboarded} />}
        </Providers>
    );
}

export default App;