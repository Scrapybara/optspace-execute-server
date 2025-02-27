import {
    Button,
    Key,
    Point,
    keyboard,
    mouse,
    sleep,
    straightTo,
  } from "@nut-tree/nut-js";
  
  const SLEEP_TIMES = {
    MOUSE_MOVE: 20,
    CLICK_PREP: 30,
    DRAG_PAUSE: 30,
    SCROLL_PREP: 20,
    WAIT: 500,
    TYPE_DELAY: 0,
  } as const;
  
  // Key mapping for special keys
  const KEY_MAP: Record<string, Key> = {
    return: Key.Enter,
    enter: Key.Enter,
    ctrl: Key.LeftCmd,
    cmd: Key.LeftCmd,
    meta: Key.LeftCmd,
    shift: Key.LeftShift,
    alt: Key.LeftAlt,
    space: Key.Space,
    backspace: Key.Backspace,
    tab: Key.Tab,
    esc: Key.Escape,
    escape: Key.Escape,
    "page down": Key.PageDown,
    pagedown: Key.PageDown,
    "page up": Key.PageUp,
    pageup: Key.PageUp,
    // ... numbers and symbols
    1: Key.Num1,
    2: Key.Num2,
    3: Key.Num3,
    4: Key.Num4,
    5: Key.Num5,
    6: Key.Num6,
    7: Key.Num7,
    8: Key.Num8,
    9: Key.Num9,
    0: Key.Num0,
    "-": Key.Minus,
    "=": Key.Equal,
    "+": Key.Add,
  };
  
  interface ComputerRequest {
    action: "key" | "type" | "mouse_move" | "left_click" | "left_click_drag" | 
           "right_click" | "middle_click" | "double_click" | "scroll" | "wait";
    coordinates?: {
      x: number;
      y: number;
      type: "screen" | "normal";
    }[];
    text?: string;
  }
  
  export interface ExecuteRequest {
    computerRequest: ComputerRequest;
    screenWidth: number;
    screenHeight: number;
    normalFactor: number;
  }
  
  export async function moveStraightTo(
    coordinate: NonNullable<ComputerRequest["coordinates"]>[number],
    screenWidth: number,
    screenHeight: number,
    normalFactor: number,
  ) {
    let x: number;
    let y: number;
  
    if (coordinate.type === "normal") {
      x = (coordinate.x * screenWidth) / normalFactor;
      y = (coordinate.y * screenHeight) / normalFactor;
    } else {
      x = coordinate.x;
      y = coordinate.y;
    }
  
    await Promise.race([
      mouse.move(straightTo(new Point(x, y))),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Mouse move timeout")), 3000),
      ),
    ]);
  }
  
  export async function execute({
    computerRequest,
    screenWidth,
    screenHeight,
    normalFactor,
  }: ExecuteRequest) {
    console.log("Starting execution", computerRequest);
  
    try {
      const { action, coordinates, text } = computerRequest;
  
      switch (action) {
        case "key":
          if (text) {
            console.debug(`Pressing keys: ${text}`);
            const keys = text
              .split(/[\s+]/)
              .map(
                (key) =>
                  KEY_MAP[key.toLowerCase()] ||
                  Key[
                    (key.charAt(0).toUpperCase() +
                      key.slice(1).toLowerCase()) as keyof typeof Key
                  ],
              );
            await keyboard.pressKey(...keys);
            await keyboard.releaseKey(...keys);
          } else {
            console.warn("No text provided for key action");
          }
          break;
  
        case "type":
          if (text) {
            console.debug(`Typing text: ${text}`);
            keyboard.config.autoDelayMs = SLEEP_TIMES.TYPE_DELAY;
            await keyboard.type(
              text.trim().replace(/\\n$/, "").replace(/\n$/, ""),
            );
            if (text.endsWith("\n") || text.endsWith("\\n")) {
              await keyboard.pressKey(Key.Enter);
              await keyboard.releaseKey(Key.Enter);
            }
            keyboard.config.autoDelayMs = 300;
          } else {
            console.warn("No text provided for type action");
          }
          break;
  
        case "mouse_move":
          if (coordinates && coordinates.length == 1) {
            await moveStraightTo(
              coordinates[0],
              screenWidth,
              screenHeight,
              normalFactor,
            );
            await sleep(SLEEP_TIMES.MOUSE_MOVE);
          } else {
            console.warn("No coordinates provided for mouse_move action");
          }
          break;
  
        case "left_click":
          if (coordinates && coordinates.length == 1) {
            await moveStraightTo(
              coordinates[0],
              screenWidth,
              screenHeight,
              normalFactor,
            );
            await sleep(SLEEP_TIMES.CLICK_PREP);
            await mouse.click(Button.LEFT);
          } else {
            await mouse.click(Button.LEFT);
            console.warn("No coordinates provided for left_click action");
          }
          break;
  
        case "left_click_drag":
          if (coordinates && coordinates.length == 2) {
            await moveStraightTo(
              coordinates[0],
              screenWidth,
              screenHeight,
              normalFactor,
            );
            await sleep(SLEEP_TIMES.CLICK_PREP);
            await mouse.pressButton(Button.LEFT);
            await sleep(SLEEP_TIMES.DRAG_PAUSE);
            await moveStraightTo(
              coordinates[1],
              screenWidth,
              screenHeight,
              normalFactor,
            );
            await sleep(SLEEP_TIMES.DRAG_PAUSE);
            await mouse.releaseButton(Button.LEFT);
          } else {
            await mouse.releaseButton(Button.LEFT);
            console.warn("No coordinates provided for left_click_drag action");
          }
          break;
  
        case "right_click":
          if (coordinates && coordinates.length == 1) {
            await moveStraightTo(
              coordinates[0],
              screenWidth,
              screenHeight,
              normalFactor,
            );
            await sleep(SLEEP_TIMES.CLICK_PREP);
            await mouse.click(Button.RIGHT);
          } else {
            await mouse.click(Button.RIGHT);
            console.warn("No coordinates provided for right_click action");
          }
          break;
  
        case "middle_click":
          if (coordinates && coordinates.length == 1) {
            await moveStraightTo(
              coordinates[0],
              screenWidth,
              screenHeight,
              normalFactor,
            );
            await sleep(SLEEP_TIMES.CLICK_PREP);
            await mouse.click(Button.MIDDLE);
          } else {
            await mouse.click(Button.MIDDLE);
            console.warn("No coordinates provided for middle_click action");
          }
          break;
  
        case "double_click":
          if (coordinates && coordinates.length == 1) {
            await moveStraightTo(
              coordinates[0],
              screenWidth,
              screenHeight,
              normalFactor,
            );
            await sleep(SLEEP_TIMES.CLICK_PREP);
            await mouse.doubleClick(Button.LEFT);
          } else {
            await mouse.doubleClick(Button.LEFT);
            console.warn("No coordinates provided for double_click action");
          }
          break;
  
        case "scroll":
          if (coordinates && coordinates.length == 2) {
            await moveStraightTo(
              coordinates[0],
              screenWidth,
              screenHeight,
              normalFactor,
            );
            await sleep(SLEEP_TIMES.SCROLL_PREP);
            if (coordinates[1].y > 0) {
              await mouse.scrollUp(coordinates[1].y);
            } else if (coordinates[1].y < 0) {
              await mouse.scrollDown(coordinates[1].y);
            }
            if (coordinates[1].x > 0) {
              await mouse.scrollRight(coordinates[1].x);
            } else if (coordinates[1].x < 0) {
              await mouse.scrollLeft(coordinates[1].x);
            }
          } else {
            console.warn("No coordinates provided for scroll action");
          }
          break;
  
        case "wait":
          console.debug(`Waiting for ${SLEEP_TIMES.WAIT}ms`);
          await sleep(SLEEP_TIMES.WAIT);
          break;
      }
  
      await sleep(300);
    } catch (error) {
      console.error("Execution failed", error);
      throw error;
    }
  }