import { NativeModules, Platform } from 'react-native';




export function getDeviceLanguage(): string {
    const deviceLanguage =
        Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
            : NativeModules.I18nManager.localeIdentifier;

    return deviceLanguage
}


const DEVICE_LANGUAGE:string = getDeviceLanguage();

export default DEVICE_LANGUAGE;