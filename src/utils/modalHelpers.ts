export interface ModalContent {
    open: boolean;
    content: string;
    id?: string;
    gameID?: string;
    zoneID?: string;
    puzzleID?: string;
    action?: string;
    gameDesigner?: string;
    userEmail?: string;
    modalStyle?: string;
    updatedDB?: boolean;
}

export const getDefaultModalContent = (): ModalContent => ({
    open: false,
    content: "",
    id: "",
    gameID: "",
    zoneID: "",
    puzzleID: "",
    action: "",
    gameDesigner: "",
    userEmail: "",
    modalStyle: "",
    updatedDB: false
});

export const createModalContent = (overrides: Partial<ModalContent>): ModalContent => ({
    ...getDefaultModalContent(),
    ...overrides
});

/* close Modal/update single game */
export const updateSingleGame = (): ModalContent => ({
    open: false,
    content: "",
    id: "",
    gameID: "",
    zoneID: "",
    puzzleID: "",
    action: "",
    gameDesigner: "",
    userEmail: "",
    modalStyle: "",
    updatedDB: true
});