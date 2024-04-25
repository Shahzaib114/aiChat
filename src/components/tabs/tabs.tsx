import React, {FC, useEffect, useRef} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {IDefaultProps} from "../../utils/types.ts";
import {ITabsItem} from "./types.ts";
import themeColors from "../../theme/colors.ts";


interface TabsProps extends IDefaultProps {
    items: ITabsItem[],
    selected?: ITabsItem,
    onChange?: (item: ITabsItem) => void,
}

const TabsHeight = 60;

const Tabs: FC<TabsProps> = ({...props}) => {
    const [selectedItem, setSelectedItem] = React.useState<ITabsItem>(props.selected || props.items[0])


    let mySelected = props.selected || selectedItem;
    return (
        <View style={styles.container}>
            {props.items.map((item, index) => {
                const Icon = item.Icon;
                return (
                    <Pressable
                        onPress={() => {
                            setSelectedItem(item)
                            props.onChange && props.onChange(item)
                        }}
                        key={index} style={{
                        ...styles.tab,
                        backgroundColor: mySelected.value === item.value ? themeColors.primary : themeColors.transparent,
                    }}>
                        {

                            Icon
                        }
                        <Text style={{
                            color: themeColors.white,
                            textAlign: "center",
                            fontFamily: "Manrope",
                            fontSize: 17,
                            fontWeight: "600",
                        }}>
                            {item.label}
                        </Text>
                    </Pressable>
                )
            })}
        </View>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        width: "100%",
        height: TabsHeight,
        backgroundColor: themeColors.blackLight,
        borderRadius: 1000,
        flexDirection: "row",
        paddingHorizontal: 2,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "#FFFFFF0F",
    },
    tab: {
        flex: 1,
        height: TabsHeight - 7,
        borderRadius: 1000,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themeColors.transparent,
        flexDirection: "row",
        gap: 5,
    }
})


export default Tabs