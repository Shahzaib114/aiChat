import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "./home/home.tsx";
import BottomNavigationTab from "../../components/bottom-navigation-tab/bottom-navigation-tab.tsx";


const Tab = createBottomTabNavigator();

interface HomeEntryProps extends IDefaultProps {

}

const HomeEntry: FC<HomeEntryProps> = ({...props}) => {

    return (
        <Tab.Navigator
            screenOptions={(route)=>{
                return {
                    headerShown: false,
                    tabBarIcon: ({focused, color, size}) => BottomNavigationTab({route, focused, color, size}),
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        height: 60,
                        backgroundColor: "#1D1D1D",
                    },
                }
            }}
            initialRouteName={'home'}
        >
            <Tab.Screen name="home" component={Home}/>
            <Tab.Screen name="history" component={Home}/>
            <Tab.Screen name="plans" component={Home}/>
            <Tab.Screen name="settings" component={Home}/>

        </Tab.Navigator>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default HomeEntry