import React, { FC, useEffect } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { IDefaultProps } from "../../utils/types.ts";
import themeColors from "../../theme/colors.ts";
import SettingsItem, { SettingsItemProps } from "./component/setting-item.tsx";
import SvgImport from "../../utils/import-svg.tsx";
import crown from "../../../assets/svgs/crown.js";
import share from "../../../assets/svgs/share.js";
import problem from "../../../assets/svgs/problem.js";
import star from "../../../assets/svgs/star.js";
import privacy from "../../../assets/svgs/privacy.js";
import { Share } from "react-native";
import { getAppShareLink } from "../../utils/utils.ts";
import useSubscription from "../../hooks/useSubscription.ts";


interface SettingsProps extends IDefaultProps {

}

interface GetAccountTypeButtonProps extends SettingsItemProps {
    accountType: "FREE" | "PREMIUM",

}

function GetAccountTypeButton({ ...props }: GetAccountTypeButtonProps) {
    let title = props.accountType === "FREE" ? "Free" : "Premium";
    let icon = props.accountType === "FREE" ? <SvgImport svg={crown} /> : <SvgImport svg={crown} />;
    const [subscription] = useSubscription()
    let packageName = props.accountType === "FREE" ? "Free" : "Weekly";
    return (
        <SettingsItem
            icon={icon}
            title={title}
            onClick={props.onClick}
            endIcon={
                props.accountType === "PREMIUM" && (
                    <Text style={{
                        color: themeColors.white,
                        fontSize: 13,
                        fontWeight: "400",
                        borderRadius: 100,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        backgroundColor: themeColors.primary,

                    }}>
                        {
                            subscription?.productIdentifier?.includes('week') ? `Weekly` :
                                subscription?.productIdentifier?.includes('monthly') ? 'Monthly' :
                                    subscription?.productIdentifier?.includes('year') ? 'yearly' :
                                        subscription?.productIdentifier?.includes('discounted') && 'Discounted Yearly'
                        }
                    </Text>
                )
            }
            {...props}
        />
    )

}

const Settings: FC<SettingsProps> = ({ ...props }) => {

    const [subscription] = useSubscription()

    async function shareApp() {
        try {
            const result = await Share.share({
                message: "Hi, I am using this amazing app. You should try it too! " + getAppShareLink(),
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    console.log("ACTIVITY TYPE: ", result.activityType);
                } else {
                    // shared
                    console.log("SHARED");
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
                console.log("DISMISSED");
            }
        } catch (error) {

        }

    }

    function getUsAppRating() {
        Linking.openURL(getAppShareLink());
    }

    return (
        <ScrollView style={styles.container}>
            <View>
                <GetAccountTypeButton
                    accountType={subscription.status === "active" ? "PREMIUM" : "FREE"}
                />
                <Text
                    style={{
                        color: "#ffffff50",
                        fontSize: 13,
                        fontWeight: "400",
                        paddingLeft: 20,
                        marginBottom: 20,
                        fontFamily: "Manrope"
                    }}
                >
                    Application
                </Text>
                <SettingsItem
                    hasBottomBorder
                    icon={<SvgImport svg={share} />}
                    onClick={shareApp}
                    title={"Share with Friends"}
                />
                <SettingsItem
                    hasBottomBorder
                    icon={<SvgImport svg={problem} />}
                    onClick={() => {
                        Linking.openURL("mailto:contact@akromaxtech.com");
                    }}
                    title={"Report a Problem"}
                />
                <SettingsItem
                    hasBottomBorder
                    icon={<SvgImport svg={star} />}

                    onClick={getUsAppRating}
                    title={"Give us Rating"}
                />
                <SettingsItem
                    hasBottomBorder
                    onClick={() => {
                        Linking.openURL("https://akromaxtech.com/privacy-policy")
                    }}
                    icon={<SvgImport svg={privacy} />}
                    title={"Privacy Policy"}
                />
                 <SettingsItem
                    hasBottomBorder
                    onClick={() => {
                        Linking.openURL("https://www.akromaxtech.com/terms-conditions")
                    }}
                    icon={<SvgImport svg={privacy} />}
                    title={"Terms and Conditions"}
                />
            </View>
        </ScrollView>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.black
    }
})


export default Settings