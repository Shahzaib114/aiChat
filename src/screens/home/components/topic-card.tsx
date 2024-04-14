import React, {FC} from "react";
import {Dimensions, FlatList, Image, StyleSheet, Text, View} from "react-native";
import {prompt, TransFormedCategory} from "../variables/types.ts";
import {IDefaultProps} from "../../../utils/types.ts";
import themeColors from "../../../theme/colors.ts";

interface TopicCardProps extends IDefaultProps, prompt {

}

const TopicCard: FC<TopicCardProps> = ({...props}) => {
    const size = Dimensions.get('window').width * 0.4;
    return (
        <View style={{
            backgroundColor: props.backgroundColor,
            width: size,
            height: Dimensions.get('window').width * 0.4,
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
                    objectFit: "contain"
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
                                                      marginHorizontal: index % 2 === 0 ? 0 : 20,
                                                      width: props?.data.length % 2 !== 0 && index === props.data.length - 1 ? "100%" : Dimensions.get('window').width * 0.4

                                                  }}

                                                  {...item} key={index}/>
                                          }
                                          columnWrapperStyle={{
                                              justifyContent: "center",
                                              alignItems: "center",

                                          }}

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
        paddingHorizontal: 10
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