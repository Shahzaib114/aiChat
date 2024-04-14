import * as React from "react";
import Svg, { Path, SvgXml, Text } from "react-native-svg";
import { memo } from "react";
import FONTS from "../../src/theme/FONTS";
import { responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import CanelSvg from "./Cancel";
import just4U from "./just4uTxt";
import { View } from "react-native";

const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={219} height={105} fill="none" {...props}>
    {/* Background Path */}
    <Path fill="#1D1D1D" fillOpacity={0.53} d="M219 45.952C219 78.564 164.379 105 97 105 29.621 105 0 47.105 0 14.494s54.621 0 122 0c67.379 0 97-1.153 97 31.458Z" />

    {/* Text in Center */}
    <Text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" fontFamily={FONTS.Manrope_Medium} >
      {props.text}
    </Text>

    {/* Text in Bottom */}
    <Text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" fontFamily={FONTS.Manrope_SemiBold}>
      {props.off}
    </Text>
  </Svg>
);

const Memo = memo(SvgComponent);
export default Memo;
