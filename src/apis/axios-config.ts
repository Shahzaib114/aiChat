import axios from "axios";
import {gptEndpoint} from "./endpoints.ts";
import {GPT_KEY} from "../utils/app-config.ts";
import {IGptMessage} from "../utils/types.ts";
import {AvailableModels, GPT4} from "../utils/gpt-models.ts";
import {prompt} from "../screens/home/variables/types.ts";
import DEVICE_LANGUAGE from "../utils/get-device-language.ts";

// let DEVICE_LANGUAGE = "es_ES"

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
    let messagesCopy = [...messages];

    if (messagesCopy.length === 0) {
        messagesCopy.push({
            role: "user",
            content: "hi"

        }, {
            role: "system",
            content: `Engage with me using only the ${DEVICE_LANGUAGE} language, utilizing pure ${DEVICE_LANGUAGE} characters. I'm only capable of understanding ${DEVICE_LANGUAGE}, so please ensure your responses are in that language. Maintain a natural and authentic writing style in ${DEVICE_LANGUAGE}, avoiding any hints of translation or prompting.
             `
        });
    }

    // if (model === GPT4) {
    //     messagesCopy.unshift({
    //         role: "system",
    //         content: "Act as a GPT-4 model and generate a response for the given messages. According to the GPT-4 model, the response will be more accurate and relevant."
    //     });
    // }

    if (customPrompt) {
        messagesCopy.unshift(
            {
                role: "system",
                content: `
                You have provided a custom prompt. The custom prompt is as follows: 
                "${customPrompt?.prompt}"
                Please generate a response for the given messages according to the custom prompt.
                Act according to prompt. 
            `
            },
            {
                role: "system",
                content: `Start asking related questions about the prompt. The first message is after this message. 
                Don't start the message with "of course," "obviously," "sure," "Great!," "understood," or anything like that.`
            }
        );
    } else {
        messagesCopy.unshift({
            role: "system",
            content: `Act according to prompt.`
        }, {
            role: "system",
            content: `The first message is after this message. 
                Don't start the message with "of course," "obviously," "sure," "Great!," "understood," or anything like that.`
        });
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
            model: model,

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

