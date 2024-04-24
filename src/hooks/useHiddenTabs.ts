import {useNavigation} from "@react-navigation/native";
import {useEffect} from "react";
import themeColors from "../theme/colors.ts";


function useHiddenTabs() {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
        return () => navigation.getParent()?.setOptions({
            tabBarStyle: {
                height: 60,
                backgroundColor: themeColors.black,
                borderTopWidth: 0,
            }
        });

    }, [navigation]);

    return null;
}

export default useHiddenTabs;