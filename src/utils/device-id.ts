const getUniqueDeviceId: () => Promise<string> = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('device-id-1234');
        }, 1000);
    });
};

export default getUniqueDeviceId;
