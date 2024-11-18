import React, {FC, useEffect, useState} from "react";
import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    Pressable,
    View,
    TouchableOpacity,
    Image,
    Dimensions
} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";
import onboardingSteps from "./variables/onboardin-steps.ts";
import Steps from "../../components/steps/steps.tsx";
import {useNavigation} from "@react-navigation/native";
import themeColors from "../../theme/colors.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ON_BOARDING} from "../../utils/constant.ts";


interface FirstOnboardingScreenProps extends IDefaultProps {

}

const OnboardingScreen: FC<FirstOnboardingScreenProps> = ({...props}) => {
    const [state, setState] = useState<number>(0);
    const navigation = useNavigation();


    return (
        <ImageBackground
            source={onboardingSteps[state].background}
            style={{flex: 1}}
        >
            <SafeAreaView
                style={styles.surfaceArea}
            >
                <View style={styles.container}>
                    <Image
                        source={onboardingSteps[state].image}
                        style={{
                            height: "70%",
                            maxHeight: "70%",
                            resizeMode: 'contain',
                        }}
                    />

                    <Text style={styles.heading}>
                        <Text style={[{
                            color: themeColors.primary
                        }]}>
                            {onboardingSteps[state]?.greenText}
                        </Text> {onboardingSteps[state].heading}
                    </Text>
                    <Text style={styles.text}>
                        {onboardingSteps[state].text}
                    </Text>

                    <Steps
                        style={{
                            marginTop: 20,
                        }}
                        totalSteps={onboardingSteps.length}
                        currentStep={state}
                    />


                </View>
                <Pressable
                    onPress={async () => {
                        if (state < onboardingSteps.length - 1) {
                            setState(state + 1)
                        } else {
                            await AsyncStorage.setItem(ON_BOARDING, 'true');
                            navigation.reset({
                                index: 0,
                                routes: [{
                                    name: 'home-entry' as never,

                                }]
                            })
                        }
                    }}

                    style={styles.button}>
                    <Text style={styles.buttonText}>
                        Continue
                    </Text>

                </Pressable>

            </SafeAreaView>
        </ImageBackground>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    surfaceArea: {
        flex: 1,
    },
    button: {
        backgroundColor: 'white',
        padding: 10,
        paddingVertical: 17,
        borderRadius: 100,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'black',
        fontSize: 14,
        fontWeight: '500'

    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        flex: 1,
    },
    heading: {
        fontSize: 24,
        marginTop: 80,
        fontWeight: '800',
        color: 'white',
    },
    text: {
        fontSize: 15,
        marginTop: 10,
        color: 'white',
        textAlign: 'center',
        fontWeight: '300',
        fontFamily: 'Manrope'

    },
    imageStyle: {
        height: 300,
        maxHeight: Dimensions.get('window').height * 5,
        resizeMode: 'contain',
    }
})


export default OnboardingScreen;