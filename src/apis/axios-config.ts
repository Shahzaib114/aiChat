import axios from "axios";
import {gptEndpoint} from "./endpoints.ts";
import {GPT_KEY} from "../utils/app-config.ts";
import {IGptMessage} from "../utils/types.ts";
import {AvailableModels, GPT4} from "../utils/gpt-models.ts";
import {prompt} from "../screens/home/variables/types.ts";
import DEVICE_LANGUAGE from "../utils/get-device-language.ts";

// let DEVICE_LANGUAGE = "ur_PK"

export const gptInstance = axios.create({
    baseURL: gptEndpoint,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GPT_KEY}`,
    }
});


export const gptSpeechToTextInstance = axios.create({
    baseURL: "https://api.openai.com/v1/audio",
    headers: {
        "Content-Type": 'multipart/form-data',
        Authorization: `Bearer ${GPT_KEY}`,
    }
});


export const gptCompletions = async (messages: IGptMessage[], model: string, customPrompt: prompt | undefined): Promise<string> => {
    let messagesCopy = [...messages]
    if (messagesCopy.length === 0) {
        messagesCopy = [
            {
                role: "user",
                content: `Talk to me in pure ${DEVICE_LANGUAGE} language. I can understand only ${DEVICE_LANGUAGE} language.
            `
            },
            ...messagesCopy
        ]
    }
    console.log(DEVICE_LANGUAGE)
    if (model === GPT4) {
        messagesCopy = [{
            role: "system",
            content: "act as a Gpt-4 model and generate a response for the given messages. according to the GPT-4 model, the response will be more accurate and relevant."
        }, ...messagesCopy]
    }
    if (customPrompt) {
        messagesCopy = [{
            role: "system",
            content: `
            you have provided a custom prompt. the custom prompt is as follows: 
            "${customPrompt?.prompt}"
            Please generate a response for the given messages according to the custom prompt.
            start with the greeting message.
            .
            `
        }, ...messagesCopy]
    } else {
        messagesCopy = [
            {
                "role": "system",
                "content": `Greet  user.
                `

            },
            ...messagesCopy
        ]
    }

    // messagesCopy= [
    //     {
    //         "role": "user",
    //         "content": `you have to reply me in this ${DEVICE_LANGUAGE} language. I can understand only ${DEVICE_LANGUAGE} language.`
    //
    //     },
    //     ...messagesCopy
    // ]


    return new Promise((resolve, reject) => {
        gptInstance.post(`/completions`, {
            messages: messagesCopy,
            max_tokens: 1000,
            model: model
        }).then((res) => {

            let response = res.data?.choices[0]?.message?.content || ""
            if (!response) {
                reject("No response from GPT")
            }
            resolve(response)
        }).catch((err) => {
            reject(err)
        })
    });

}