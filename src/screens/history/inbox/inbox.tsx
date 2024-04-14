import React, {FC} from "react";
import {FlatList, Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";
import InBoxHeader from "./components/inbox-header.tsx";
import dummyData from "./variables/dummy-data.ts";
import InBoxItem from "./components/ibox-chat-item.tsx";


interface InBoxProps extends IDefaultProps {

}

const InBox: FC<InBoxProps> = ({...props}) => {

    return (
        <View style={styles.container}>
            <FlatList data={dummyData}
                      renderItem={
                          ({item, index}) => <InBoxItem key={index} title={item.title}
                                                        totalMessages={item.totalMessages} time={item.time}/>
                      }
                      style={{width: "100%"}}
                      ListFooterComponent={() => (
                          <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                marginTop: 20,

                          }}>

                              <Pressable style={styles.button}>
                                  <Text style={styles.text}>+ New Chat</Text>
                              </Pressable>
                          </View>
                      )}
            />


        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        backgroundColor: themeColors.black,
        flex: 1,
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
    },
    button: {
        backgroundColor: themeColors.primary,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 1000,
        width: 200,
    },
    text: {
        fontFamily: "Manrope",
        color: themeColors.white,
        fontSize: 18,
        fontWeight: "500",
    }
})


export default InBox