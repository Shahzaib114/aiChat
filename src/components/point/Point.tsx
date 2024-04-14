import { StyleSheet, Text, View } from "react-native";
import FONTS from "../../theme/FONTS";

export const Point = ({ color, Icon, text }: any) => {
    return (
        <View style={styles.pointview}>
            {Icon}
            <Text style={[styles.pointTxt, { color }]}>{text}</Text>
        </View >
    );
};
const styles = StyleSheet.create({
    pointview: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    },
    pointTxt: {
        fontSize: 15,
        fontFamily: FONTS.Manrope_Regular,
        width: '85%',
        alignSelf: 'center'
    },

})


export default Point