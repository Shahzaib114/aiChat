import {useEffect, useState} from "react";
import {RewardedAd, RewardedAdEventType} from "react-native-google-mobile-ads";
import adUnitId from "./google-adds-config.ts";

interface RewardedAdActions {
    show: () => void;
    loadAndShow: () => void;
    load: () => void;
}

const rewardedAdd = RewardedAd.createForAdRequest(adUnitId, {
    keywords: [
        'fashion',
        'clothing',
        'apparel',
        'shoes',
        'accessories',
        'ecommerce',
        'shopping',
        'retail',

    ],
});

export default function useRewardedAdd(onWatch: () => void): [boolean, RewardedAdActions] {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [loadAndShow, setLoadAndShow] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribeLoaded = rewardedAdd.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setLoaded(true);
            loadAndShow && rewardedAdd.show();
        });

        const unsubscribeEarned = rewardedAdd.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            (reward) => {
                onWatch?.()
                setLoaded(false)
                rewardedAdd.load();
            }
        );

        // rewardedAdd.addAdEventsListener((type, error, data) => {
        //     console.log('RewardedAd event:', type, error, data);
        // });
        rewardedAdd.load();

        return () => {
            console.log('Ad removed');
            unsubscribeLoaded();
            unsubscribeEarned();
        };
    }, []);


    let actions: RewardedAdActions = {
        show: () => {
            if (rewardedAdd.loaded)
                rewardedAdd.show();
            else {
                rewardedAdd.load();
                setLoadAndShow(true)
                setLoaded(false)
            }
        },
        loadAndShow: () => {
            rewardedAdd.load();
            setLoadAndShow(true)
            setLoaded(false)
        },
        load: () => {
            rewardedAdd.load();
            setLoaded(false)
            setLoadAndShow(false)
        }
    }

    return [loaded, actions];
}