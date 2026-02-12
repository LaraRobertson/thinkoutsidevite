import type { Schema } from "../../amplify/data/resource";

export type Game = Schema["Game"]["type"];
export type City = Schema["City"]["type"];
export type GamePlayZone = Schema["GamePlayZone"]["type"];

export interface GameDetails {
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
    latitude?: string;
    longitude?: string;
    gameLevel?: string;
}