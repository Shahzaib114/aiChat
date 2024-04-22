import {tabProps} from "./components/tab-button.tsx";
import {category, TransFormedCategory} from "./variables/types.ts";
import TopicCardLayout from "./components/topic-card.tsx";
import QuestionLayout from "./components/question-layout.tsx";
import React from "react";

export function extractKeys(data: category): tabProps[] {
    let tabData: tabProps[] = Object.keys(data).map((key: string, index: number) => {
        return {text: key, id: index + 1};
    });
    tabData = [{
        text: 'All',
        id: 0
    }, ...tabData]

    return tabData;
}


export function TransFormData(data: category, selectedTab: number): TransFormedCategory[] {
    let myData = data;
    if (selectedTab != 0) {

        myData = {
            // @ts-ignore
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

