import {RewardedAd, TestIds} from 'react-native-google-mobile-ads';
import {Platform} from "react-native";

const adUnitId_Live = Platform.select({
    // https://developers.google.com/admob/ios/test-ads
    ios: "ca-app-pub-4691213171381908/6507639343",
    // https://developers.google.com/admob/android/test-ads
    android: "ca-app-pub-4691213171381908/7575795544",
});

const adUnitId_Test = Platform.select({
    // https://developers.google.com/admob/ios/test-ads
    ios: TestIds.REWARDED,
    // https://developers.google.com/admob/android/test-ads
    android: TestIds.REWARDED,
});


const adUnitId = __DEV__ ? adUnitId_Test || "" : adUnitId_Live || "";



export default adUnitId;