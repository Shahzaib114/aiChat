import * as React from 'react';
import Root from "./src/screens/root/root.tsx";
import Providers from "./providers.tsx";
import { useEffect, useState } from "react";
import { ON_BOARDING } from "./src/utils/constant.ts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from '@react-native-firebase/app';
import { getAnalytics } from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { Platform } from 'react-native';
import { getDatabaseInstance } from './src/utils/firebaseInstance.tsx';

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

    const IosAppConfig = {
        name: "EVA AI iOS",
        options: {
            apiKey: "AIzaSyATkBi0aKxNazur07v9Dpn_pYo1oMmrPi8",
            projectId: "chatbot-11ebc",
            storageBucket: "chatbot-11ebc.appspot.com",
            messagingSenderId: "456140348125",
            appId: "1:456140348125:web:8e2a7d55f52536f2961934",
        }
    };

    const firstAppConfig = {
        name: "EVA AI Android",
        options: {
            apiKey: "AIzaSyCzhf-Wgtyy3MMGokoPoqO-K86GMG49Cso",
            projectId: "chatbot-e0ca6",
            storageBucket: "chatbot-e0ca6.appspot.com",
            messagingSenderId: "369948763061",
            appId: "1:369948763061:web:dd26da1c2b348d876c2ffc",
        }
    };

    useEffect(() => {
        if (Platform.OS === 'ios') {
            getDatabseInstance()
        } else {
            const analytics = getAnalytics(); // Use the primary app for Android
            crashlytics();
        }
        getAnalytics().logEvent('your_event');
        crashlytics().log('Your log message');
    }, [])
    const getDatabseInstance = async () => {
        const iosApp = initializeApp(IosAppConfig.options, IosAppConfig.name);
        initializeApp(IosAppConfig.options, IosAppConfig.name)
        const analytics = getAnalytics(iosApp)
        const databaseInstance = getDatabaseInstance();
        crashlytics();
        await AsyncStorage.setItem('iosDatabaseInstance', JSON.stringify(databaseInstance))
    }

    return (
        <Providers>
            {isReady && <Root onboarded={onboarded} />}
        </Providers>
    );
}

export default App;