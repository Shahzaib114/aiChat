import React, { FC } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { IDefaultProps } from "../../utils/types.ts";
import themeColors from "../../theme/colors.ts";
import { TransFormedCategory } from "./variables/types.ts";
import TabComponent, { tabProps } from "./components/tab-button.tsx";
import TopicCardLayout from "./components/topic-card.tsx";
import QuestionLayout from "./components/question-layout.tsx";

import useCategories from "../../hooks/useCategories.ts";
import HomeInput from "./components/home-input.tsx";
import HomeSkeletonAnimation from "../../components/skeleton-anim/home-skeleton-anim/home-skeleton-anim.tsx";
import TabSkeletonAnim from "../../components/skeleton-anim/home-skeleton-anim/tab-skeleton-anim.tsx";

interface HomeProps extends IDefaultProps {

}

const Home: FC<HomeProps> = ({ ...props }) => {
    const [data, loading] = useCategories();
    const [selectedTab, setSelectedTab] = React.useState<number>(0);


    function extractKeys(): tabProps[] {

        let tabData: tabProps[] = Object.keys(data).map((key: string, index: number) => {
            return { text: key, id: index + 1 };
        });
        tabData = [{
            text: 'All',
            id: 0
        }, ...tabData]

        return tabData;
    }

    function TransFormData(): TransFormedCategory[] {
        let myData = data;
        if (selectedTab != 0) {
            myData = {
                [extractKeys()[selectedTab].text]: data[extractKeys()[selectedTab].text]
            }
        }
        let Obj: TransFormedCategory[] = Object.keys(myData).map((key: string, index: number) => {
            return {
                title: key,
                // @ts-ignore
                data: data[key].hasOwnProperty("prompts") ? data[key].prompts : data[key],
                type: data[key].hasOwnProperty("prompts") ? "topic" : "question"
            };
        });
        return Obj
    }

    function GetCategoryComponent({ type, title, data }: TransFormedCategory) {
        //     checking if the item have prompts key in it
        if (type === "topic") {
            return <TopicCardLayout title={title}
                isSelected={extractKeys()[selectedTab].text === title}
                // @ts-ignore
                type={type} data={data} />
        }
        // @ts-ignore
        return <QuestionLayout title={title} type={type} data={data} />
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginVertical: 10 }}>
                <FlatList data={extractKeys()}
                    contentContainerStyle={{

                    }}
                    ListHeaderComponent={<TabSkeletonAnim loading={loading} />}
                    renderItem={({ item }) => <TabComponent
                        isSelected={selectedTab === item.id}
                        onPress={() => setSelectedTab(item.id)}
                        text={item.text} />}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <FlatList data={TransFormData() as TransFormedCategory[]}
                ListEmptyComponent={<HomeSkeletonAnimation loading={loading} />}
                renderItem={({ item }) => <GetCategoryComponent
                    {...item}
                />}
                contentContainerStyle={{
                    paddingBottom: 20
                }}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}

                keyExtractor={(item) => item.title}
                showsVerticalScrollIndicator={false}
            />
            {!loading && <HomeInput />}
        </SafeAreaView>
    )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        backgroundColor: themeColors.black,
        flex: 1,
        gap: 10,

    }
})


export default Home