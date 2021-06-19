export enum ClientMessages {
    LoginToGame = 'C_LoginToGame',
    BeginDrawChooseWord = 'C_BeginDraw_ChooseWord',
    CanvasClear = 'C_Canvas_Clear',
    CanvasCommands = 'C_Canvas_Commands',
    GuessSubmit = 'C_Guess_Submit',
}

export enum ServerMessages {
    ConfirmGameLogin = 'S_ConfirmGameLogin',
    DenyGameLogin = 'S_DenyGameLogin',
    EstablishGameState = 'S_EstablishGameState',
    AddGamePlayer = 'S_AddGamePlayer',
    RemoveGamePlayer = 'S_RemoveGamePlayer',
    BeginDrawNotify = 'S_BeginDraw_Notify',
    BeginDrawNotifyStart = 'S_BeginDraw_NotifyStart',
    WordUpdate = 'S_Word_Update',
    CanvasClear = 'S_Canvas_Clear',
    CanvasCommands = 'S_Canvas_Commands',
    GuessChatUpdate = 'S_GuessChat_Update',
    BeginDrawNotifySelf = 'S_BeginDraw_Notify_Self',
    BeginDrawNotifyStartSelf = 'S_BeginDraw_NotifyStart_Self',
    GuessNotifyOfResult = 'S_Guess_NotifyOfResult',
    EndDrawNotify = 'S_EndDraw_Notify',
    EndGame = 'S_EndGame',
}

export interface LoginToGame {
    _message: ClientMessages.LoginToGame,
    username: string,
    color: `#${string}`,
    censorUserContent: boolean,
}

export interface ConfirmGameLogin {
    _message: ServerMessages.ConfirmGameLogin,
}

export interface DenyGameLogin {
    _message: ServerMessages.DenyGameLogin,
}

export enum GuessChatMessageType {
    UNSUCCESSFUL,
    SUCCESSFUL,
    POST_WIN,
}

export interface GuessChatUpdate {
    _message: ServerMessages.GuessChatUpdate,
    type: GuessChatMessageType,
    playerId: number,
    contents?: string,
    color: number,
}

export type Message =
      LoginToGame
    | ConfirmGameLogin
    | DenyGameLogin
    | GuessChatUpdate
