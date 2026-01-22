import {View} from "@aws-amplify/ui-react";
import React from "react";
import type { GameDetailsVar } from "../types/game";

interface MapProps {
    gameDetailsVar?: GameDetailsVar;
}

export default function Map({gameDetailsVar}: MapProps) {
    console.log("Map");
    if (gameDetailsVar) {
        console.log("lattitude: " + gameDetailsVar.latitude1);
    }
    
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.789!2d-80.846131!3d32.017789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDAxJzA0LjAiTiA4MMKwNTAnNDYuMSJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`;
    
    return (
        <View className="mapInModal" height="400px" width="100%">
            <iframe
                src={mapUrl}
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Game Location Map"
            />
        </View>
    );
}

export { Map };