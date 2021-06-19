# WebSocket Protocol

Version 1.0

## Commands

### `C_LoginToGame`

Attempts to log in to a game.

### `S_ConfirmGameLogin`

Confirms successful login attempt.

### `S_DenyGameLogin`

Confirms unsuccessful login attempt.

### `S_EstablishGameState`

Establishes initial game state.

### `S_AddGamePlayer`

Notifies of a new player.

### `S_RemoveGamePlayer`

Notifies of a removed player.

### `S_BeginDraw_Notify`

Notifies that a player is about to start drawing.

### `S_BeginDraw_NotifyStart`

Notifies that a player has chosen a word and is going to be drawing.

### `S_Word_Update`

Updates the word currently being guessed.

### `S_Canvas_Clear`

Clears the local canvas.

### `S_Canvas_Commands`

Updates the local canvas with a set of commands.

### `S_GuessChat_Update`

Notifies of a new entry in the guess chat.

`contents` is only populated if `type === 'unsuccessful' || type === 'postWin'`

#### Fields

* `type`: `0 | 1 | 2`
* `playerId`: `number`
* `contents?`: `string`

#### Types

* `0`: Normal unsuccessful guess
* `1`: Successful guess
* `2`: Post-win guess, appears in green (only sent if local player has already won)

### `S_BeginDraw_Notify_Self`

Notifies that the local player is about to start drawing, and provides word choices.

### `C_BeginDraw_ChooseWord`

Chooses a word from the list.

### `S_BeginDraw_NotifyStart_Self`

Confirms the word choice, and that the local player is going to be drawing.

### `C_Canvas_Clear`

Clears the distant canvases.

### `C_Canvas_Commands`

Updates the distant canvases with a set of commands.

### `C_Guess_Submit`

Submits a guess.

### `S_Guess_NotifyOfResult`

Notifies local player of the result of their guess.

#### Fields

* `successful`: `boolean`
* `contents`: `string`

### `S_EndDraw_Notify`

Notifies of the end of a drawing and updates player state.

### `S_EndGame`

Notifies of the end of a game, and provides final player state.