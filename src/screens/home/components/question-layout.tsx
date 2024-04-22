import React, {FC} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {prompt, TransFormedCategory} from "../variables/types.ts";
import themeColors from "../../../theme/colors.ts";
import database from "@react-native-firebase/database";
import useSession from "../../../hooks/useSession.ts";
import {formateDateTo12HoursTime} from "../../../utils/formate-date.ts";
import {USER_ROLE} from "../../../utils/roles.ts";
import {useNavigation} from "@react-navigation/native";


interface QuestionLayoutProps extends TransFormedCategory {
    data: string[]
}

const QuestionLayout: FC<QuestionLayoutProps> = ({...props}) => {
    const [session] = useSession();
    const navigation = useNavigation();

    function onQuestionClick(question: string) {
        let refInbox = database().ref(`users/${session?.user}/inbox`);
        let id = refInbox.push().key;
        if (!id) return;
        refInbox.child(id).set({
            id: id,
            messages: [{
                id: Date.now().toString(),
                text: question,
                role: USER_ROLE,
                createdAt: formateDateTo12HoursTime(new Date()),
                user: session?.user
            }],
        });

        // @ts-ignore
        navigation.navigate("history", {
            screen: "chat",
            params: {
                inboxRef: id,
                startGettingResponse: true,
            }
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.title}</Text>
            {
                props.data.map((item, index) => {
                    return (
                        <Pressable
                            key={index}
                            onPress={() => onQuestionClick(item)}
                        >
                            <Text
                                style={
                                    styles.text2
                                }
                            >{index + 1}. {item}</Text>
                        </Pressable>
                    )


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
    text2: {
        color: "white",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginTop: 10,
        paddingVertical: 15,
        backgroundColor: themeColors.blackLight,
    }
})


export default QuestionLayout