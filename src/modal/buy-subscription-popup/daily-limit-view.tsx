import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";
import SvgImport from "../../utils/import-svg.tsx";
import starts from "../../../assets/svgs/starts.js";
import {FREE_DAIL_MESSAGE_LIMIT} from "../../utils/app-config.ts";
import themeColors from "../../theme/colors.ts";
import {useNavigation} from "@react-navigation/native";
import alerticon from "../../../assets/svgs/alerticon.js";


interface DailyLimitViewProps extends IDefaultProps {
    closePopUp?: () => void
    onCancel?: () => void
}

const DailyLimitView: FC<DailyLimitViewProps> = ({...props}) => {
    const navigate = useNavigation()

    return (
        <View style={styles.container}>
            <SvgImport svg={alerticon}/>
            <Text style={{color: 'white', textAlign: "center", fontSize: 14, marginTop: 20}}>
                You have {FREE_DAIL_MESSAGE_LIMIT} free daily requests
                for ChatBot. To unlock unlimited access, upgrade to PRO.
            </Text>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                gap: 20
            }}>
                <Pressable
                    onPress={props.onCancel}
                    style={[styles.btn, {
                        backgroundColor: "#2B2B2B",
                    }]}
                >

                    <Text style={[styles.buttonText]}>
                        Cancel
                    </Text>
                </Pressable>
                <Pressable
                    onPress={()=>{
                        // @ts-ignore
                        navigate.navigate('plans')
                        props.closePopUp?.()

                    }}
                    style={[styles.btn, {
                        backgroundColor: themeColors.primary,
                    }]}
                >

                    <Text style={[styles.buttonText]}>
                        Continue
                    </Text>
                </Pressable>

            </View>
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Manrope'
    },
    btn: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColors.black,
    }
})


export default DailyLimitView