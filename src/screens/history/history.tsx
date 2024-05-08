import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { IDefaultProps } from "../../utils/types.ts";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InBox from "./inbox/inbox.tsx";
import { StackParamList } from "./types.ts";


const Stack = createNativeStackNavigator<StackParamList>();

interface HistoryScreenProps extends IDefaultProps {

}

const HistoryScreen: FC<HistoryScreenProps> = ({ ...props }) => {


    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={'inbox'}
        >
            <Stack.Screen
                name={'inbox'} component={InBox} />
            {/*<Stack.Screen*/}
            {/*    name={'chat'}*/}
            {/*    initialParams={{*/}
            {/*        inboxRef: "-1"*/}
            {/*    }}*/}
            {/*    options={{}}*/}
            {/*    component={ChatScreen}/>*/}
        </Stack.Navigator>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default HistoryScreen