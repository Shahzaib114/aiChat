import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {TransFormedCategory} from "../variables/types.ts";
import themeColors from "../../../theme/colors.ts";


interface QuestionLayoutProps extends TransFormedCategory {
    data: string[]
}

const QuestionLayout: FC<QuestionLayoutProps> = ({...props}) => {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.title}</Text>
            {
                props.data.map((item, index) => {
                    return <Text
                        style={
                           styles.text2
                        }
                        key={index}>{index+1}. {item}</Text>
                })
            }
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        gap: 5,
        paddingHorizontal: 20
    },
    text: {
        fontSize: 20,
        paddingBottom: 10,
        fontWeight: "700",
        color: "white",
        textTransform: "capitalize"
    },
    text2:{
        color: "white",
        borderRadius:10,
        paddingHorizontal: 15,
        fontSize:16,
        marginTop: 10,
        paddingVertical: 15,
        backgroundColor: themeColors.blackLight,
    }
})


export default QuestionLayout