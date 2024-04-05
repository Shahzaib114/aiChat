import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";


interface HomeProps extends IDefaultProps {

}

const Home: FC<HomeProps> = ({...props}) => {

    return (
        <View>
            <Text>Home</Text>
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default Home