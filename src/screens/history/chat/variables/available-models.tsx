import {ITabsItem} from "../../../../components/tabs/types.ts";
import SvgImport from "../../../../utils/import-svg.tsx";
import crown from "../../../../../assets/svgs/crown.js";
import React from "react";
import {GPT3, GPT4} from "../../../../utils/gpt-models.ts";


const AvailableModels: ITabsItem[] = [
    {
        label: "Chat GPT 3",
        value: GPT3,
    }, {
        label: "Chat GPT 4",
        value: GPT4,
        Icon: <SvgImport svg={crown}/>
    }
]

export default AvailableModels