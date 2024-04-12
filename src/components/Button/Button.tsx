import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IDefaultProps } from "../../../src/utils/types";
import { responsiveFontSize, responsiveScreenFontSize, responsiveScreenWidth } from "react-native-responsive-dimensions";
import FONTS from "../../theme/FONTS";

interface ButtonProps extends IDefaultProps {
  text: string;
  onPress: () => void;
}

const ButtonComponent: FC<ButtonProps> = ({ text, onPress, ...props }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width:'95%',
    alignSelf:'center',
    backgroundColor: "white",
    padding: responsiveFontSize(2.5),
    borderRadius: responsiveFontSize(1.5),
    borderWidth: 1,
    borderColor: "black",
  },
  text: {
    color: "black",
    textAlign: "center",
    fontSize: responsiveScreenFontSize(2),
    fontFamily: FONTS.Manrope_Medium
  },
});

export default ButtonComponent;
