import {View} from "@aws-amplify/ui-react";
import {useState} from "react";
import type { GameDetailsVar } from "../types/game";

interface MapProps {
    gameDetailsVar?: GameDetailsVar;
}

export default function Map({gameDetailsVar}: MapProps) {
    console.log("Map");
    if (gameDetailsVar) {
        console.log("lattitude: " + gameDetailsVar.latitude1);
    }
    //Jaycee Park Sign: 32.017789, -80.846131
    const [{latitude, longitude}, setMarkerLocation] = useState({
        latitude: 32.00490,
        longitude: -80.50575,
    });
    <iframe
        src=""
        width="600" height="450" style="border:0;" allowFullScreen="" loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"></iframe>

    console.log("Map Url (gameLevel): " + gameDetailsVar.gameLevel);
    return (
        <View className="mapInModal">
            <iframe
                src={gameDetailsVar.gameLevel}
                style={{border: 0, borderRadius: '8px'}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Game Location Map"
            />
        </View>
    );
}

export {Map};