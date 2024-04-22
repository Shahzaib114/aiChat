import axios from "axios";
import {gptEndpoint} from "./endpoints.ts";
import {GPT_KEY} from "../utils/app-config.ts";
import {IGptMessage} from "../utils/types.ts";
import {AvailableModels, GPT4} from "../utils/gpt-models.ts";


export const gptInstance = axios.create({
    baseURL: gptEndpoint,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GPT_KEY}`,
    }
});

export const gptCompletions = async (messages: IGptMessage[], model: string): Promise<string> => {
    let messagesCopy = [...messages]
    if (model === GPT4) {
        messagesCopy = [{
            role: "system",
            content: "act as a Gpt-4 model and generate a response for the given messages. according to the GPT-4 model, the response will be more accurate and relevant."
        }, ...messagesCopy]
    }
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