# WebSocket Protocol

Version 1.0

## Data Types

### `HexColor`

`string` with format `/#\w+/`

### `User`

#### Fields

* `username`: `string`
* `color`: `HexColor`
* `id`: `int`

### `DrawCommand`

`any[]`

* element `0`: `DrawCommandType`
* elements `1-X`: `any` - arguments to draw command - see below

#### Draw command arguments

For `DrawCommandType === 0`: `[number, number, string]` - in order: x position, y position, color 

### DrawCommandType

`Enum<number>`

* `0`: Pen stroke

## Commands

### `C_LoginToGame`

Attempts to log in to a game.

#### Fields

* `username`: `string` - Must be between 2 and 16 characters, inclusively.
* `color`: `HexColor`
* `censorUserContent`: `boolean` - Whether the server should censor user content sent to the client

### `S_ConfirmGameLogin`

Confirms successful login attempt.

* `user`: `User`

### `S_DenyGameLogin`

Confirms unsuccessful login attempt.

#### Fields

* `reason?`: `string`

### `S_EstablishGameState`

Establishes initial game state.

### `S_AddGamePlayer`

Notifies of a new player.

#### Fields

* `user`: `User`

### `S_RemoveGamePlayer`

Notifies of a removed player.

#### Fields

* `id`: `number` - ID of the removed user

### `C_BeginGame`

Notifies that the host wishes to start the game.

#### Requirements

- The sending player must be the host.

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

### Fields

* `commands`: `DrawCommand[]`

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

### Fields

* `commands`: `DrawCommand[]`

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
