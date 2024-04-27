import React, {FC} from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import themeColors from "../../../theme/colors.ts";


interface HomeSkeletonAnimationProps extends IDefaultProps {

}

const HomeSkeletonAnimation: FC<HomeSkeletonAnimationProps> = ({...props}) => {
    const height: number = Dimensions.get('window').width / 3;
    return (
        <View style={{
            flex: 1,
            padding: 10,
            paddingBottom: 180,


        }}>
            <SkeletonPlaceholder
                backgroundColor={themeColors.blackLight}
                highlightColor={"#282525"}
                borderRadius={4}>
                <View style={{flexDirection: 'column', alignItems: 'flex-start', gap: 20}}>
                    <View style={{
                        flexDirection: 'column',
                    }}>
                        <View style={{width: 120, height: 20,
                            borderRadius: 4, marginBottom: 10}}
                        />
                        <View style={{
                            height: height,
                            flexDirection: 'row',
                            width: '100%',
                            gap: 10,

                        }}
                        >
                            <View style={{flex:1, height: height, borderRadius: 10}}
                            />
                            <View style={{flex:1, height: height, borderRadius: 10}}/>
                        </View>

                    </View>
                    <View style={{
                        flexDirection: 'column',
                    }}>
                        <View style={{width: 120, height: 20,
                            borderRadius: 4, marginBottom: 10}}
                        />
                        <View style={{
                            height: height,
                            flexDirection: 'row',
                            width: '100%',
                            gap: 10,

                        }}
                        >
                            <View style={{flex:1, height: height, borderRadius: 10}}
                            />
                            <View style={{flex:1, height: height, borderRadius: 10}}/>
                        </View>

                    </View>
                    <View style={{
                        flexDirection: 'column',
                    }}>
                        <View style={{width: 120, height: 20,
                            borderRadius: 4, marginBottom: 10}}
                        />
                        <View style={{
                            height: height,
                            flexDirection: 'row',
                            width: '100%',
                            gap: 10,

                        }}
                        >
                            <View style={{flex:1, height: height, borderRadius: 10}}
                            />
                            <View style={{flex:1, height: height, borderRadius: 10}}/>
                        </View>

                    </View>
                    <View style={{
                        flexDirection: 'column',
                    }}>
                        <View style={{width: 120, height: 20,
                            borderRadius: 4, marginBottom: 10}}
                        />
                        <View style={{
                            height: height,
                            flexDirection: 'row',
                            width: '100%',
                            gap: 10,

                        }}
                        >
                            <View style={{flex:1, height: height, borderRadius: 10}}
                            />
                            <View style={{flex:1, height: height, borderRadius: 10}}/>
                        </View>

                    </View>
                </View>

            </SkeletonPlaceholder>
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({})


export default HomeSkeletonAnimation