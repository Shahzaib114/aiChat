import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import BottomNavigationTab from "../../components/bottom-navigation-tab/bottom-navigation-tab.tsx";
import themeColors from "../../theme/colors.ts";
import Subscription from "../payments/subscription.tsx";
import HomeHeader from "../home/components/home-header.tsx";
import Home from "../home/home.tsx";
import InBox from "../history/inbox/inbox.tsx";
import InBoxHeader from "../history/inbox/components/inbox-header.tsx";
import HistoryScreen from "../history/history.tsx";


const Tab = createBottomTabNavigator();

interface HomeEntryProps extends IDefaultProps {

}

const HomeEntry: FC<HomeEntryProps> = ({...props}) => {

    return (
        <Tab.Navigator
            screenOptions={(route) => {
                return {
                    headerShown: false,
                    tabBarIcon: ({focused, color, size}) => BottomNavigationTab({route, focused, color, size}),
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        height: 60,
                        backgroundColor: themeColors.black,
                        borderTopWidth: 0,
                    },
                    tabBarBackground: () => <View style={{
                        backgroundColor: themeColors.blackLight,
                        flex: 1,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}/>,
                    tabBarHideOnKeyboard: true,
                }
            }}
            initialRouteName={'home'}
        >
            <Tab.Screen name="home"
                        options={{
                            headerShown: true,
                            header: () => <HomeHeader/>
                        }}
                        component={Home}/>
            <Tab.Screen name="history"

                        component={HistoryScreen}/>

            <Tab.Screen name="plans" component={Subscription}/>
            <Tab.Screen name="settings" component={Home}/>


        </Tab.Navigator>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default HomeEntry