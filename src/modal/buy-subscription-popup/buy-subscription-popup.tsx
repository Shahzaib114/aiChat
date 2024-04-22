import React, {Component} from "react";
import {Dimensions, Modal, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import themeColors from "../../theme/colors.ts";
import DailyLimitView from "./daily-limit-view.tsx";
import BuySubscriptionView from "./buy-subscription-view.tsx";
import {Animated} from "react-native";

type BuySubscriptionPopupProps = {}

type BuySubscriptionPopupState = {
    visible: boolean,
    view: "daily-limit" | "subscription"
}


class BuySubscriptionPopup extends Component<BuySubscriptionPopupProps, BuySubscriptionPopupState> {
    constructor(props: BuySubscriptionPopupProps) {
        super(props)
        super.state = {
            visible: false,
            view: "subscription"
        }
    }

    animate = new Animated.Value(0);

    show() {
        this.setState({visible: true})
    }

    close() {
        this.setState({visible: false})
    }

    showBuySubscription() {
        this.setState({view: "subscription"})
        this.show()
    }

    showDailyLimit() {
        this.setState({view: "daily-limit"})
        this.show()
    }

    componentDidMount() {
        Animated.timing(this.animate, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true
        }).start()
    }

    render() {
        return (
            <Modal
                // animationType="slide"
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => {
                    this.close()
                }}>
                <View style={[styles.mainContainer]}>
                    <Animated.View style={[styles.container, {

                    }]}>
                        {this.state.view === "daily-limit" && <DailyLimitView
                            onCancel={() => {
                                this.close()
                            }}
                            onContinue={() => {
                                this.close()
                            }}
                        />}
                        {
                            this.state.view === "subscription" && <BuySubscriptionView
                                onCancel={() => {
                                }}
                                onWatch={() => {
                                }}
                            />
                        }
                    </Animated.View>
                </View>
            </Modal>
        )
    }


}


const styles: any = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',

        padding: 20,
        backgroundColor: themeColors.blackLight,
        width: "80%",
        borderRadius: 10,

    },
    mainContainer: {
        backgroundColor: "rgba(0,0,0,0.2)",
        flex: 1,
        justifyContent: "center",
        marginBottom: Dimensions.get("window").height / 12,
        alignItems: "center",
    },
    cardStyle: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "rgba(250,250,250,0.98)",

        borderRadius: 18,

    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    subHeading: {
        fontSize: 14,
        textAlign: "center",
        paddingHorizontal: 4,

    },
    button: {
        marginTop: 15,
        backgroundColor: "#011818",
        paddingVertical: 10,

        borderRadius: 10,
        elevation: 3,
    }
})

export default BuySubscriptionPopup