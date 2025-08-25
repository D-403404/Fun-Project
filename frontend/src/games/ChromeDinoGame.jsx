import React from "react";

import GameCanvas from "../components/2d-engine/GameCanvas";

const ChromeDinoGame = ({ parentRef }) => {
    return (
        <GameCanvas
            parentRef={parentRef}
            backgroundColor="0xFFFFFF"
        ></GameCanvas>
    );
};

export default ChromeDinoGame;
