import { useEffect, useState } from "react";
import "./TranscriptBox.css";

const TranscriptBox = ({ transcript, response }) => {
    const [indianVoice, setIndianVoice] = useState(null);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(
                (v) => v.lang === "en-IN" || v.name.toLowerCase().includes("india")
            );
            if (selectedVoice) {
                setIndianVoice(selectedVoice);
            }
        };

        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        loadVoices();
    }, []);

    useEffect(() => {
        if (response && indianVoice) {
            const utterance = new SpeechSynthesisUtterance(response);
            utterance.voice = indianVoice;
            utterance.lang = "en-IN";
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;
            window.speechSynthesis.speak(utterance);
        }
    }, [response, indianVoice]);

    return (
        <div className="transcript-box">
            <p><strong>🩺 You said:</strong></p>
            <p className="user-transcript">{transcript || "..."}</p>

            {response && (
                <>
                    <p><strong>🤖 Medical Assistant:</strong></p>
                    <p className="ai-response">{response}</p>
                </>
            )}
        </div>
    );
};

export default TranscriptBox;
