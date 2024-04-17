import {StyleSheet} from "react-native";
import themeColors from "../../../../../theme/colors.ts";


const variantsStyles:{[key: string]: StyleSheet.NamedStyles<any>} = {
    error: StyleSheet.create({
        container: {
            backgroundColor: themeColors.red,
        },
        text: {
            color: "white",
        },
        buttonText: {
            color: themeColors.red,
        }
    }),
    success: StyleSheet.create({
        container: {
            backgroundColor: "green",
        },
        text: {
            color: "white",
        },
        buttonText: {
            color:  "green",
        }
    }),
    info: StyleSheet.create({
        container: {
            backgroundColor: themeColors.blue,
        },
        text: {
            color: themeColors.white
        },
        buttonText: {
            color:   themeColors.blue
        }
    })
};

export default variantsStyles;