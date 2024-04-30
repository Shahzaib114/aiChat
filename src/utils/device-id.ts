import DeviceInfo from 'react-native-device-info';

const getUniqueDeviceId: () => Promise<string> = () => {
    return new Promise(async (resolve, reject) => {
        let deviceId = await DeviceInfo.getUniqueId();

        resolve(deviceId);
    });
};

export default getUniqueDeviceId;
