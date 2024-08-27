import { Platform } from 'react-native';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

// Utility function to get the correct Firebase Database instance
export const getDatabaseInstance = () => {
    if (Platform.OS === 'ios') {
        // Use the secondary app for iOS
        const databaseApp = firebase.app('secondary');
        return database(databaseApp);
    } else {
        // Use the default app for Android
        return database();
    }
};
