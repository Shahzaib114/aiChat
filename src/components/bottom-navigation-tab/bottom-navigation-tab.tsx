import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";
import PlanIcon from "../icons/PlanIcon.tsx";
import SvgImport from "../../utils/import-svg.tsx";
import TabButton from "./tab-button.tsx";
import HomeIcon from "../icons/HomeIcon.tsx";
import SettingsIcon from "../icons/SettingsIcon.tsx";
import ChatHistoryIcon from "../icons/ChatHistoryIcon.tsx";

interface BottomNavigationTabProps extends IDefaultProps {
    route: any,
    focused: boolean,
    color: string,
    size: number

}


const BottomNavigationTab: FC<BottomNavigationTabProps> = ({focused, route, ...props}) => {

    switch (route?.route?.name) {
        case 'home':
            return <TabButton name={"home"} focused={focused} currentRoute={route?.route?.name} Icon={HomeIcon}/>
        case 'settings':
            return <TabButton name={"settings"}  focused={focused} currentRoute={route?.route?.name} Icon={SettingsIcon}/>
        case "history":
            return <TabButton name={"history"} focused={focused}  currentRoute={route?.route?.name} Icon={ChatHistoryIcon}/>
        case "plans":
            return <TabButton name={"plans"} focused={focused}  currentRoute={route?.route?.name} Icon={PlanIcon}/>
        default:
            return <TabButton name={"home"} focused={focused}  currentRoute={route?.route?.name} Icon={HomeIcon}/>
    }

}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        flex: 1,
    }
})


export default BottomNavigationTab