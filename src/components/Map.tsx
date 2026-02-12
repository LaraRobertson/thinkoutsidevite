import {View} from "@aws-amplify/ui-react";
import type { Game, GameDetails } from "../types/game";

interface MapProps {
    gameDetails?: GameDetails;
    gameIntro: boolean;
}

export function Map(props:MapProps) {
    console.log("Map");
    const { gameDetails, gameIntro } = props;
    let mapSource: string | undefined = "";
    if (gameDetails) {
        console.log("latitude: " + gameDetails.latitude);
        if (gameIntro) {
            mapSource = gameDetails.latitude;
        } else {
            mapSource = gameDetails.longitude;
        }
    }

    //Jaycee Park Sign: 32.017789, -80.846131
    /*const [{latitude, longitude}, setMarkerLocation] = useState({
        latitude: 32.00490,
        longitude: -80.50575,
    });
    <iframe
        src=""
        width="600" height="450" style="border:0;" allowFullScreen="" loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"></iframe>*/

    console.log("Map Url (gameLevel): " + gameDetails?.latitude);
    return (
        <View className="mapInModal">
            <iframe
                src={mapSource}
                style={{border: 0, borderRadius: '8px'}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Game Location Map"
                allow="geolocation"
            />
        </View>
    );
}

interface MapGameProps {
    game?: Game;
    gameIntro: boolean;
}

export function MapGame(props:MapGameProps) {
    console.log("MapGame");
    const { game, gameIntro } = props;
    let mapSource: string | undefined = "";
    if (game) {
        console.log("latitude: " + game.latitude);
        if (gameIntro) {
            mapSource = game.latitude || undefined;
        } else {
            mapSource = game.longitude || undefined;
        }
    }

    //Jaycee Park Sign: 32.017789, -80.846131
    /*const [{latitude, longitude}, setMarkerLocation] = useState({
        latitude: 32.00490,
        longitude: -80.50575,
    });
    <iframe
        src=""
        width="600" height="450" style="border:0;" allowFullScreen="" loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"></iframe>*/

    console.log("Map Url (gameLevel): " + game?.latitude);
    return (
        <View className="mapInModal">
            <iframe
                src={mapSource}
                style={{border: 0, borderRadius: '8px'}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Game Location Map"
                allow="geolocation"
            />
        </View>
    );
}