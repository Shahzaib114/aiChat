import Voice, {SpeechErrorEvent} from '@react-native-voice/voice';
import {useEffect, useState} from "react";
import {SpeechResultsEvent} from "@react-native-voice/voice/src/VoiceModuleTypes.ts";
import DEVICE_LANGUAGE from "../utils/get-device-language.ts";

interface SpeechToTextActions {
    start: () => void;
    stop: () => void;
    convert: () => void;
}


export default function useSpeechToText(onResult: (result: string) => void, onError: (e: SpeechErrorEvent) => void): [boolean, SpeechToTextActions] {
    const [converting, setConverting] = useState<boolean>(false);

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
        setConverting(false);
        Voice.stop();
    }

    function start() {
        setConverting(true);
        Voice.start(DEVICE_LANGUAGE);
    }

    useEffect(() => {

        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;

        return () => {
            console.log('Voice removed');
            Voice.destroy().then(Voice.removeAllListeners);
        }

    }, []);


    let actions: SpeechToTextActions = {
        start: start,
        stop: stop,

    } as SpeechToTextActions;

    return [converting, actions];
}