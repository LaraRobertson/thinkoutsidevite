import { dataService } from "../../services/dataService";
/*import { saveAs } from 'file-saver';*/

interface CopyGameProps {
    gameID: string;
    gameName: string;
}

export default async function copyGame(props: CopyGameProps): Promise<void> {
    console.log("gameName: " + props.gameName);
    const fileName1 = props.gameName + ".txt";
    
    try {
        const client = dataService.getClient();
        const { data: gameFromAPI } = await client.models.Game.get({ id: props.gameID });
        
        if (gameFromAPI) {
            const { id, ...gameData } = gameFromAPI;
            const file = new Blob([JSON.stringify(gameData)], { type: 'text/plain;charset=utf-8' });
            /*saveAs(file, fileName1);*/
        }
    } catch (err) {
        console.log('error fetching Game', err);
    }
}
