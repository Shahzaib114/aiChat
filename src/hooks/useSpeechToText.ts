import Voice, {SpeechErrorEvent} from '@react-native-voice/voice';
import {useEffect, useState} from "react";
import {SpeechResultsEvent} from "@react-native-voice/voice/src/VoiceModuleTypes.ts";
import DEVICE_LANGUAGE from "../utils/get-device-language.ts";
import {gptInstance} from "../apis/axios-config.ts";

interface SpeechToTextActions {
    start: () => void;
    stop: () => void;
    convert: () => void;
}


export default function useSpeechToText(onResult: (result: string) => void, onError: (e: SpeechErrorEvent) => void): [boolean, boolean, SpeechToTextActions] {
    const [converting, setConverting] = useState<boolean>(false);
    const [startedRecording, setStartedRecording] = useState<boolean>(false);
    const [isViewUnMounted,setIsViewUnMounted] = useState(false);


    function convertSpeechToText(){
        setConverting(true)
        setTimeout(() => {
            setConverting(false);
            onResult("hello this is a test")
        }, 2000);
    }

    function onSpeechResults(e: SpeechResultsEvent) {
        setConverting(false)

        if (e?.value && e?.value?.length > 0) {
            onResult(e.value[0]);

        } else
            onResult('')
    }

    function onSpeechError(e: SpeechErrorEvent) {
        setConverting(false);
        console.log("Error", e);
        onError(e);
    }

    function stop() {
        setStartedRecording(false);
        convertSpeechToText()
    }

    function start() {
        setStartedRecording(true);

    }

    useEffect(() => {

        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;
        setIsViewUnMounted(false)
        return () => {
            console.log('Voice removed');
            Voice.destroy().then(Voice.removeAllListeners);
            setIsViewUnMounted(true)
        }

    }, []);


    let actions: SpeechToTextActions = {
        start: start,
        stop: stop,

    } as SpeechToTextActions;

    return [startedRecording, converting, actions];
}