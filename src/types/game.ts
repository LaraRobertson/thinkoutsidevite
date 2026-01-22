import type { Schema } from "../../amplify/data/resource";

export type Game = Schema["Game"]["type"];
export type City = Schema["City"]["type"];
export type GamePlayZone = Schema["GamePlayZone"]["type"];

export interface GameDetailsVar {
    email: string;
    gameName: string;
    gameID: string;
    gameLocationCity: string;
    gameDescription?: string;
    gameSummary?: string;
    gameIntro?: string;
    gameLogisticInfo?: string;
    gameGoals?: string;
    gamePlayZoneImage1?: string;
    waiverSigned?: string;
    numberOfTimes?: number;
    latitude1?: string;
    longitude1?: string;
    gameLevel?: string;
}

export interface WaiverResult {
    waiverSigned: boolean;
    numberOfTimes: number;
}

export interface GameDetails {
    waiverSigned?: string;
    numberOfTimes?: number;
}