import React from "react";
import { Howl, Howler } from "howler";

import RegisterModal from "@/components/RegisterModal";
import Button from "@/components/Button";
import { shuffleArray } from "@/utils/commonUtils";

import { HiSpeakerWave } from "react-icons/hi2";
import { HiSpeakerXMark } from "react-icons/hi2";

import bgmList from "@/data/bgm-synthwave";

export default function RegisterPage() {
    // Test playlist playback
    // const bgmList = [
    //     "/space-shooter/sounds/laser-sfx.mp3",
    //     // "/space-shooter/sounds/laser-sfx.mp3",
    //     "/space-shooter/sounds/explosion-312361.mp3",
    // ];

    React.useMemo(() => shuffleArray(bgmList), []);
    const bgm = React.useRef(null);
    const [playingIdx, setPlayingIdx] = React.useState(0);
    const [bgmActive, setBgmActive] = React.useState(true);

    React.useEffect(() => {
        console.log("Shuffled BGM list:", bgmList);
    }, []);

    React.useEffect(() => {
        if (bgm.current) {
            bgm.current.unload(); // Unload previous audio to free resources
        }

        bgm.current = new Howl({
            src: [bgmList[playingIdx]],
            html5: true,
            autoplay: true,
            volume: 1.0,
            onload: () => {
                console.log("Playing:", bgmList[playingIdx]);
            },
            onend: () => {
                setPlayingIdx((prev) => (prev + 1) % bgmList.length);
            },
        });
    }, [playingIdx]);

    React.useEffect(() => {
        if (bgmActive) Howler.mute(false);
        else Howler.mute(true);
    }, [bgmActive]);

    return (
        <div className="relative h-screen text-white flex flex-col gap-4 items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <video
                    src="/retro-dynamic-wallpaper.mp4"
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute top-2 left-2 text-white text-2xl grid grid-cols-2 grid-rows-1 gap-2 z-10">
                <>
                    <p>BGM</p>
                    <div>
                        <Button
                            isIcon
                            onClick={() => setBgmActive((prev) => !prev)}
                        >
                            {bgmActive ? <HiSpeakerWave /> : <HiSpeakerXMark />}
                        </Button>
                    </div>
                </>
            </div>
            <RegisterModal className="bg-black/70 z-10" />
        </div>
    );
}
