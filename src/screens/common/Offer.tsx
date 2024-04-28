import {
  ImageBackground, SafeAreaView, StyleSheet,
  Text,
  View,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OfferTop from "../../../assets/svgs/offerTop";
import OfferCenter from "../../../assets/svgs/OfferCenter";
import Rocket from "../../../assets/svgs/Rocket";
import PartyPopper from "../../../assets/svgs/PartyPopper";
import RobotHead from "../../../assets/svgs/RobotHead";
import FONTS from "../../theme/FONTS";
import themeColors from "../../theme/colors";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { TouchableOpacity } from "react-native";
import Point from "../../components/point/Point";
import Purchases from 'react-native-purchases';

const Offer = () => {
  const [discountedProduct, setDiscountedProduct] = useState<any>()

  useEffect(() => {
    getInAppProducts()
  }, [])
  const handlePurchase = async (selectedProduct: any) => {
    try {
      const purchasing = await Purchases.purchasePackage(selectedProduct);
      console.log('purchased', purchasing)
    } catch (e) {
      console.log('go error in offering', e)
    }
  };

  const getInAppProducts = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.all !== null) {
        // Display packages for sale
        console.log('Discounted Offer', JSON.stringify(offerings.all?.Discounted))
        setDiscountedProduct(offerings.all?.Discounted?.availablePackages[0])
      }
    } catch (e) {
      console.log('go error in offering', e)
    }
  }

  return (
    <ImageBackground
      source={require("../../../assets/images/bg.png")}
      style={{ flex: 1, justifyContent: 'space-between' }}
      resizeMode="cover"
    >
      <SafeAreaView
        style={styles.safeareaview}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'space-between', flexGrow: 1 }}>
          <View
            style={styles.view2}
          >
            <Entypo onPress={() => { }} name="cross" size={30} color="white" />
          </View>

          <View style={styles.view3}>
            <OfferTop text={`This is Just for`} off={"You!"} />
            <OfferCenter heading={"Special Offer"} off={"-50%"} />
            <View style={styles.view4}>
              <Point
                Icon={<AntDesign name="star" size={24} color="yellow" style={styles.iconStyle} />}
                color={"white"}
                text={"Unlimited chat messages"}
              />
              <Point
                Icon={<Rocket style={styles.iconStyle} />}
                color={"white"}
                text={"Improved Answers AI"}
              />
              <Point
                Icon={<PartyPopper size={14} style={styles.iconStyle} />}
                color={"white"}
                text={
                  <Text>
                    No <Text style={{ color: themeColors.red }}>ADS</Text> in the app
                  </Text>
                }
              />
              <Point
                Icon={<RobotHead style={styles.iconStyle} />}
                color={"white"}
                text={
                  <Text style={{ color: "white", fontFamily: FONTS.Manrope_Regular }}>
                    Powered by{" "}
                    <Text style={{ color: "lightgreen", fontFamily: FONTS.Manrope_Bold }}>ChatGPT 4</Text>
                  </Text>
                }
              />
            </View>

            <View style={styles.view5}>
              <View style={styles.view6} >
                <Text
                  style={styles.view6text1}
                >
                  Only{" "}
                  <Text
                    style={
                      styles.view6text2
                    }
                  >
                    $34.99
                  </Text>
                </Text>
                <Text
                  style={
                    styles.view6text3
                  }
                >
                  {discountedProduct?.product?.description}
                </Text>
                <Text
                  style={
                    styles.view6text4
                  }
                >
                  (Less than US$0.05 per day)
                </Text>
              </View>

              <View
                style={styles.view7}>
                <Text
                  style={styles.view7text}>
                  Automatically renewable. Cancel whenever you want.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.btnStyle}
                onPress={() => { handlePurchase(discountedProduct) }}
              >
                <Text
                  style={styles.takeOfferTxt}
                >
                  Take this Offer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Offer;

const styles = StyleSheet.create({
  btnStyle: {
    width: '95%',
    alignSelf: 'center',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: responsiveFontSize(1),
    backgroundColor: themeColors.white
  },
  iconStyle: {
    width: '10%'
  },
  takeOfferTxt: {
    color: themeColors.black,
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Manrope_Medium,
    margin: responsiveFontSize(2)
  },
  safeareaview: {
    flexGrow: 1,
    width: '100%',
    padding: 10,
  },
  view2: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  view3: {
    alignItems: "center",
    gap: 10,
    width: "100%"
  },
  view4: {
    gap: 10,
    width: '70%',
    alignSelf: 'center',
    marginLeft: '9%'
  },
  view5: {
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: responsiveFontSize(3)
  },
  view6: {
    width: "100%",
    alignItems: "center",
  },
  view6text1: {
    color: "white",
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Manrope_ExtraBold
  },
  view6text2: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  view6text3: {
    color: "white",
    marginLeft: 10,
    fontSize: responsiveFontSize(2.5),
    fontFamily: FONTS.Manrope_ExtraBold
  },
  view6text4: {
    color: "white",
    marginLeft: 10,
    fontSize: responsiveFontSize(1.4),
    fontFamily: FONTS.Manrope_ExtraBold
  },
  view7: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  view7text: {
    color: "white",
    fontSize: responsiveFontSize(1.4),
    fontFamily: FONTS.Manrope_ExtraBold
  }
});
