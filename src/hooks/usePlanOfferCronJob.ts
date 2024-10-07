import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  FIRST_TIME_OFFER_FLAG,
  LAST_TIME_OFFER_OPENED,
} from '../utils/constant.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSubscription from './useSubscription.ts';
import Purchases from 'react-native-purchases';

export default function usePlanOfferCronJob() {
  const navigation = useNavigation();
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [lastTimePopUpHasBeen24Hours, setLastTimePopUpHasBeen24Hours] =
    useState<boolean>(false);
  const [subscription, actions] = useSubscription();

  async function checkIfUserFirstTimeLoggedIn() {
    let firstTimeOfferFlag = await AsyncStorage.getItem(FIRST_TIME_OFFER_FLAG);
    if (firstTimeOfferFlag === null) {
      await AsyncStorage.setItem(FIRST_TIME_OFFER_FLAG, 'false');
      setIsFirstTime(true);
      return true;
    }
    setIsFirstTime(false);
    return true;
  }

  async function checkIfLastTimePopUpHasBeen24Hours() {
    let lastTimeOpenDate = await AsyncStorage.getItem(LAST_TIME_OFFER_OPENED);
    if (lastTimeOpenDate === null) {
      setLastTimePopUpHasBeen24Hours(true);
      return;
    }
    //     string to int
    let lastTimeOpenDateInt = parseInt(lastTimeOpenDate);
    let currentTime = new Date().getTime();
    let timeDiff = Math.abs(lastTimeOpenDateInt - currentTime);
    let millisecondsIn24Hours = 24 * 60 * 60 * 1000;
    if (timeDiff >= millisecondsIn24Hours) {
      setLastTimePopUpHasBeen24Hours(true);
      return;
    }
  }

  function focusListener() {}

  useEffect(() => {
    checkIfUserFirstTimeLoggedIn();
    checkIfLastTimePopUpHasBeen24Hours();
  }, []);

  useEffect(() => {
    let res = subscription.productIdentifier?.includes('discounted');
    if (!actions.isLoaded) return;
    if (!isFirstTime && lastTimePopUpHasBeen24Hours && !res) {
      AsyncStorage.setItem(
        LAST_TIME_OFFER_OPENED,
        new Date().getTime().toString(),
      ).then(() => {
        navigation.navigate('Offer' as never);
      });
    }
  }, [
    isFirstTime,
    lastTimePopUpHasBeen24Hours,
    subscription.status,
    actions.isLoaded,
  ]);
}
