import { useState, useEffect, useRef } from "react";

import "../styles.css";

export type DialogueProps = {
  commandDelimiter?: string;
  commandHandler?: (command: string, ind: number) => number;
  cursor?: string;
  delayMap?: { [key: string]: number };
  globalInput?: boolean;
  height?: number | string;
  onComplete?: () => void;
  text: (string | number | Function)[];
  typeSpeed?: number;
  width?: number | string;
};

export const DialoguePropsDefault = {
  globalInput: false,
  typeSpeed: 50,
};

export const DialogueState = {
  Printing: 0,
  Waiting: 1,
  Done: 2,
  Finished: 3,
};

export default function Dialogue(props: DialogueProps) {
  const [text, setText] = useState(props.text);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [state, setState] = useState(DialogueState.Printing);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const [printTimeout, setPrintTimeout] = useState<number>(null);
  const [active, setActive] = useState(false);

  const commandHandler = (val: string, ind: number): number => {
    if (!props.commandDelimiter || val.charAt(0) === props.commandDelimiter) {
      const spaceInd = val.indexOf(" ");
      const parts = [
        val.slice(props.commandDelimiter?.length || 0, spaceInd),
        val.slice(spaceInd + 1),
      ];
      const command = parts[0];

      switch (command) {
        case "alert":
          alert(parts[1]);
          return ind + 1;
        default:
          return ind;
      }
    }
    return ind;
  };

  const addCharacter = (ind: number) => {
    const val = text[ind];
    setLineIndex((lineInd) => {
      if (typeof val !== "string") return;
      if (lineInd + 1 >= val.length) {
        finishPrinting(ind);
        return lineInd;
      }

      const letter = val.substring(lineInd, lineInd + 1);
      let delay = props.typeSpeed;
      if (props.delayMap && props.delayMap[letter] && ind < val.length - 1)
        delay += props.delayMap[letter];
      setCurrentLine((line: string) => line + letter);
      setPrintTimeout(setTimeout(() => addCharacter(ind), delay));
      return lineInd + 1;
    });
  };

  const startDialogueLine = (ind: number) => {
    while (ind < text.length) {
      const val = text[ind];
      if (typeof val === "function") {
        val();
      } else if (typeof val === "number") {
        setActive(false);
        setTimeout(() => {
          startDialogueLine(ind + 1);
        }, val);
        return;
      } else {
        const result = props.commandHandler
          ? props.commandHandler(val, ind)
          : commandHandler(val, ind);
        if (result === ind) break;
        ind = result;
      }
    }
    setActive(true);

    if (ind >= text.length) {
      if (state !== DialogueState.Finished) {
        setState(DialogueState.Finished);
        if (props.onComplete) props.onComplete();
        else setCurrentLine("Done!");
      }
      return;
    }

    if (props.typeSpeed === 0) {
      finishPrinting(ind);
      return;
    }

    setIndex(ind);
    setLineIndex(0);
    setCurrentLine("");
    setState(DialogueState.Printing);

    addCharacter(ind);
  };

  const finishPrinting = (ind: number) => {
    const val = text[ind];
    if (typeof val !== "string") return;
    setCurrentLine(val);
    setLineIndex(val.length);
    setState(DialogueState.Done);
    setPrintTimeout((timeout) => {
      clearTimeout(timeout);
      return null;
    });
  };

  const receivedInput = (choice: string = "") => {
    if (stateRef.current === DialogueState.Printing)
      finishPrinting(indexRef.current + 1);
    else if (stateRef.current === DialogueState.Done) {
      setIndex(indexRef.current + 1);
      startDialogueLine(indexRef.current + 1);
    }
  };

  useEffect(() => {
    startDialogueLine(0);
  }, [text]);

  const wrapperRef = useRef(null);
  if (props.globalInput) {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        receivedInput();
      }
    };
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [wrapperRef]);
  }

  return (
    <div
      style={{
        width: props.width || "fit-content",
        height: props.height || "fit-content",
      }}
      className={"dialogue-outer-container " + (!active && "dialogue-inactive")}
      ref={wrapperRef}
      onClick={() => receivedInput()}
    >
      <div className="dialogue-inner-container">
        <div className="dialogue-text">
          {currentLine}
          {state === DialogueState.Printing &&
            props.cursor !== undefined &&
            props.cursor}
        </div>
      </div>
    </div>
  );
}

Dialogue.defaultProps = DialoguePropsDefault;
