import React from "react";
import { Howl, Howler } from "howler";

import NavBar from "@/components/NavBar";
import { AudioButton, AudioButtonGrid } from "../components/Button";
import ChromeDinoGame from "@/games/ChromeDinoGame";

export default function LandingPage() {
    const bgm = React.useRef(null);
    const [bgmActive, setBgmActive] = React.useState(true);

    React.useEffect(() => {
        bgm.current = new Howl({
            src: "/games/chrome-dino/audios/Theme From Jurassic Park (Jurassic Park OST).mp3",
            html5: true,
            loop: true,
        });
        return () => {
            Howler.unload();
        };
    }, []);

    React.useEffect(() => {
        if (bgmActive) bgm.current.mute(false);
        else bgm.current.mute(true);
    }, [bgmActive]);

    return (
        <div className="relative h-screen text-chrome-dino-grey font-pixelifysans font-semibold text-xl">
            <NavBar className="relative z-10" />
            <AudioButtonGrid className="text-chrome-dino-grey top-12">
                <AudioButton
                    audioName="BGM"
                    audioActive={bgmActive}
                    setAudioActive={setBgmActive}
                />
            </AudioButtonGrid>
            <div
                id="game-container"
                className="absolute top-0 left-0 w-full h-full bg-chrome-dino-white"
            >
                <ChromeDinoGame playBgm={() => bgm.current.play()} />
            </div>
        </div>
    );
}
