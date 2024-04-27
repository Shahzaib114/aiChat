import React, {FC} from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import themeColors from "../../../theme/colors.ts";


interface TabSkeletonAnimProps extends IDefaultProps {
    loading?: boolean
}

const TabSkeletonAnim: FC<TabSkeletonAnimProps> = ({...props}) => {
    const height: number = Dimensions.get('window').width / 3;

    if (!props.loading) {
        return null
    }
    return (
        <View style={{
            padding: 10,
            width: '100%',

        }}>
            <SkeletonPlaceholder
                backgroundColor={themeColors.blackLight}
                highlightColor={"#282525"}
                borderRadius={4}>
                <View style={{flexDirection: 'row', alignItems: 'flex-start', gap: 10}}>
                    <View
                        style={{
                            borderRadius:20,
                            width: 90,
                            height: 25,
                        }}
                        />
                    <View
                        style={{
                            borderRadius:20,
                            width: 90,
                            height: 25,
                        }}
                    />
                    <View
                        style={{
                            borderRadius:20,
                            width: 90,
                            height: 25,
                        }}
                    />
                    <View
                        style={{
                            borderRadius:20,
                            width: 90,
                            height: 25,
                        }}
                    />
                </View>

            </SkeletonPlaceholder>
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default TabSkeletonAnim