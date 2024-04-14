import * as React from "react";
import Svg, { Path, Text } from "react-native-svg";
import { memo } from "react";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import FONTS from "../../src/theme/FONTS";
import themeColors from "../../src/theme/colors";

const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={290} height={190} fill="none" {...props}>
    {/* Background Path */}
    <Path
      fill="#A7C5FF"
      fillOpacity={0.63}
      d="M292 89c-13.5 53.001-64.695 100.027-144.5 100.027S0 102.382 0 40.526c0-61.856 81.695-34.5 161.5-34.5S292 27.145 292 89Z"
    />

    {/* Text in Center - "Special Offer" */}
    <Text x="50%" y="35%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize={responsiveFontSize(4)} fontFamily={FONTS.Manrope_ExtraBold}>
      {props.heading}
    </Text>

    {/* Text Below - "-50%" */}
    <Text x="50%" y="75%" dominantBaseline="middle" textAnchor="middle" fill={themeColors.yellow} fontSize={responsiveFontSize(9)} fontFamily={FONTS.Manrope_ExtraBold}>
      {props.off}
    </Text>
  </Svg>
);

const Memo = memo(SvgComponent);
export default Memo;
