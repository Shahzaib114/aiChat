import React, {FC} from "react";
import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import {prompt, TransFormedCategory} from "../variables/types.ts";
import {IDefaultProps} from "../../../../utils/types.ts";
import themeColors from "../../../../theme/colors.ts";

interface TopicCardProps extends IDefaultProps, prompt {

}

const TopicCard: FC<TopicCardProps> = ({...props}) => {

    return (
        <View style={{
            backgroundColor: props.backgroundColor,
            width: 165,
            height: 166,
            gap: 10,
            borderRadius: 25,
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: "center",
            alignItems: "center",
            ...props.style
        }}>

            <Image
                source={{
                    uri: props.logo
                }}
                style={{
                    width: 40,
                    height: 40,
                    objectFit: "cover"
                }}
            />

            <Text style={{color: themeColors.white, textAlign: "center", fontSize: 16, fontWeight: "500"}}>
                {props.title}
            </Text>

        </View>
    )

}

interface TopicCardLayoutProps extends TransFormedCategory {
    data: prompt[],
    isSelected?: boolean
}

const TopicCardLayout: FC<TopicCardLayoutProps> = ({...props}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.title}</Text>
            {props.isSelected ? <FlatList data={props.data}
                                          renderItem={({item, index}) =>
                                              <TopicCard
                                                  style={{
                                                      marginHorizontal: 10
                                                  }}

                                                  {...item} key={index}/>
                                          }
                                          style={{}}
                                          ItemSeparatorComponent={() => <View style={{
                                              height: 20,
                                          }}/>}

                                          numColumns={2}
                                          showsVerticalScrollIndicator={false}
            /> : <FlatList data={props.data}
                           renderItem={({item, index}) =>
                               <TopicCard {...item} key={index}/>
                           }
                           ItemSeparatorComponent={() => <View style={{
                               width: 20
                           }}/>}
                           horizontal={true}
                           showsHorizontalScrollIndicator={false}
            />
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
    }
})


export default TopicCardLayout