import { useState } from "react";

export const useSpeechToText = () => {
    const [transcript, setTranscript] = useState("");

    let recognition;
    if ("webkitSpeechRecognition" in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = "en-US";
        recognition.onresult = (event) => {
            setTranscript(event.results[0][0].transcript);
        };
    }

    const startListening = () => recognition?.start();
    const stopListening = () => recognition?.stop();

    return { transcript, startListening, stopListening };
};
