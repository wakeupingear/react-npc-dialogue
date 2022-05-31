# React NPC Dialogue
A game-like dialogue library for modular and functional dialogue boxes

## Installation

    npm install react-npc-dialogue


## Usage
``` js
import Dialogue from 'react-npc-dialogue';

export function Demo() {
    const exampleText = [
        'Hello, my name is John Doe.',
        'I am going to now stop talking for one second.',
        1000,
        'I am back.',
        '$alert Now I am a floating window!',
        '...Ok bye.',
    ];

    return (
        <Dialogue
            text={exampleText}
            delimiter={'$'}
        />
    );
}
```
## Props

* `text (Required)`: Array of strings, numbers, and functions, which will be rendered sequentially as dialogue
* `cursor`: String to use as the cursor while typing
* `delayMap`: Object of delay times to use for certain characters (Ex: have the printout pause for 300ms after every comma)
* `globalInput`: Boolean, whether the user can click anywhere on the screen to advance dialogue
* `onComplete`: Function to call when dialogue is finished
* `typeSpeed`: Number of milliseconds between each character
* `width` and `height`: Size of the dialogue box

Additional props are available when using the command parser.

## Command Parser

The `text` array can contain commands as well as regular text. These commands can do a variety of things:
* `alert`: Display an alert box with the text following the command

You can also pass a number as the command, which will be used as a delay (in milliseconds) between the command and the next line of text.

Command-Related Props:
* `commandDeliminter`: String to use as the command delimiter (character at the start of a command)
* `commandHandler`: Custom Function to call when a command is entered. The current commands are all implemented in the default handler, but this allows you to pass your own if needed.

## Styling

By default, the dialogue is styled with the included CSS. You can override this by applying your own styles to the following classes:
* `dialogue-outer-container`
* `dialogue-inner-container`
* `dialogue-text`
* `dialogue-inactive`