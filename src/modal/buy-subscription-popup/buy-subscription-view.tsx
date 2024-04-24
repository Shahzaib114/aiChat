import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";
import SvgImport from "../../utils/import-svg.tsx";
import starts from "../../../assets/svgs/starts.js";
import {FREE_DAIL_MESSAGE_LIMIT} from "../../utils/app-config.ts";
import themeColors from "../../theme/colors.ts";
import add from "../../../assets/svgs/add.js";
import useRewardedAdd from "../../google-adds/useRewardedAdd.ts";


interface BuySubscriptionViewProps extends IDefaultProps {
    onWatch?: () => void
    onCancel?: () => void
    closePopUp?: () => void
}

const BuySubscriptionView: FC<BuySubscriptionViewProps> = ({...props}) => {
    const [add_loaded, actions] = useRewardedAdd(props.onWatch || (() => {
    }))
    return (
        <View style={styles.container}>

            <Text style={{color: 'white', textAlign: "center", fontSize: 14, marginTop: 20}}>
                You have reached the maximum
                number of messages for today.
                Purchase our Subscription or
                watch an ad for more message requests.
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
                    onPress={() => {
                        if (add_loaded) {
                            actions.show()
                            props.closePopUp?.()
                        }
                    }}
                    style={[styles.btn, {
                        backgroundColor: themeColors.primary,
                    }]}
                >

                    <Text style={[styles.buttonText]}>
                        Watch Ad
                    </Text>
                    <SvgImport svg={add}/>
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
        flexDirection: 'row',
        gap: 10
    }
})


export default BuySubscriptionView