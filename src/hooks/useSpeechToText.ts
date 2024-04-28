import {useEffect, useRef, useState} from "react";
import {SpeechResultsEvent} from "@react-native-voice/voice/src/VoiceModuleTypes.ts";
import DEVICE_LANGUAGE from "../utils/get-device-language.ts";
import {gptInstance, gptSpeechToTextInstance} from "../apis/axios-config.ts";
import {PermissionsAndroid, Platform} from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player/index";
import {getUrl} from "../utils/utils.ts";

interface SpeechToTextActions {
    start: () => Promise<void>;
    stop: () => void;
    convert: () => void;
}


export default function useSpeechToText(onResult: (result: string) => void, onError: (e: string) => void): [boolean, boolean, SpeechToTextActions] {
    const [converting, setConverting] = useState<boolean>(false);
    const [startedRecording, setStartedRecording] = useState<boolean>(false);
    const [isViewUnMounted, setIsViewUnMounted] = useState(false);
    const audioRecorderPlayer = useRef<AudioRecorderPlayer>();
    const [url, setUrl] = useState<string>("");
    const [result, setResult] = useState<string>("");
    async function AskAudioPermissionForAndroid() {
        if (Platform.OS !== 'android')
            return;
        try {
            const grants = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);
            if (
                grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.RECORD_AUDIO'] ===
                PermissionsAndroid.RESULTS.GRANTED
            ) {
                return true
            }
        } catch (e) {

        }

        return false;

    }

    function convertSpeechToText(voiceUrl: string) {
        console.log(voiceUrl)
        setConverting(true)
        let form = new FormData();
        form.append("file", getUrl(voiceUrl));
        form.append("model", "whisper-1")
        gptSpeechToTextInstance.post("/transcriptions", form)
            .then(response => {
                console.log('Transcription:', response.data);
                onResult(response?.data?.text || "")
            })
            .catch(error => {
                console.log(error?.message)
                console.log(error)
                console.error('Error converting speech to text:', error);
                setConverting(false)
                onError("Error Converting speech to text")
            })
            .finally(() => {
                // Reset the state to indicate conversion is completed
                setConverting(false);
            });


    }


    function stop() {
        console.log("stop called====")
        setStartedRecording(false);
        audioRecorderPlayer.current?.stopRecorder().then((result) => {
                setStartedRecording(false)
                convertSpeechToText(url);
                console.log("onStop=>", result)
            }
        )
    }

    async function start() {
        setStartedRecording(true);
        let permisson = AskAudioPermissionForAndroid()
        if (!permisson) {
            setStartedRecording(false);
            onError("")
            return;
        }
        audioRecorderPlayer.current?.startRecorder().then((result) => {
                setUrl(result);
            }
        )

    }

    useEffect(() => {
        setIsViewUnMounted(false)
        audioRecorderPlayer.current = new AudioRecorderPlayer();

        return () => {
            console.log('Voice removed');
            audioRecorderPlayer.current?.removePlayBackListener()
            audioRecorderPlayer.current?.removeRecordBackListener()
            audioRecorderPlayer.current = undefined;
            setIsViewUnMounted(true)
            setConverting(false)
            setStartedRecording(false)
            stop();
        }

    }, []);


    let actions: SpeechToTextActions = {
        start: start,
        stop: stop,

    } as SpeechToTextActions;

    return [startedRecording, converting, actions];
}