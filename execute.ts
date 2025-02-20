import {
    Button,
    Key,
    Point,
    keyboard,
    mouse,
    sleep,
    straightTo,
  } from "@nut-tree/nut-js";
  
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
  
  async function moveTo(
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
  
    await mouse.move(straightTo(new Point(x, y)));
  }
  
  export async function execute({
    computerRequest,
    screenWidth,
    screenHeight,
    normalFactor,
  }: {
    computerRequest: ComputerRequest;
    screenWidth: number;
    screenHeight: number;
    normalFactor: number;
  }) {
    const { action, coordinates, text } = computerRequest;
  
    switch (action) {
      case "key":
        if (text) {
          const keys = text
            .split(/[\s+]/)
            .map(key => KEY_MAP[key.toLowerCase()] || 
                 Key[(key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()) as keyof typeof Key]);
          await keyboard.pressKey(...keys);
          await keyboard.releaseKey(...keys);
        }
        break;
  
      case "type":
        if (text) {
          keyboard.config.autoDelayMs = 2;
          await keyboard.type(text.trim().replace(/\\n$/, "").replace(/\n$/, ""));
          if (text.endsWith("\n") || text.endsWith("\\n")) {
            await keyboard.pressKey(Key.Enter);
            await keyboard.releaseKey(Key.Enter);
          }
          keyboard.config.autoDelayMs = 300;
        }
        break;
  
      case "mouse_move":
        if (coordinates?.length === 1) {
          await moveTo(coordinates[0], screenWidth, screenHeight, normalFactor);
        }
        break;
  
      case "left_click":
        if (coordinates?.length === 1) {
          await moveTo(coordinates[0], screenWidth, screenHeight, normalFactor);
          await sleep(100);
          await mouse.click(Button.LEFT);
        } else {
          await mouse.click(Button.LEFT);
        }
        break;
  
      case "left_click_drag":
        if (coordinates?.length === 2) {
          await moveTo(coordinates[0], screenWidth, screenHeight, normalFactor);
          await sleep(100);
          await mouse.pressButton(Button.LEFT);
          await sleep(100);
          await moveTo(coordinates[1], screenWidth, screenHeight, normalFactor);
          await sleep(100);
          await mouse.releaseButton(Button.LEFT);
        }
        break;
  
      case "right_click":
        if (coordinates?.length === 1) {
          await moveTo(coordinates[0], screenWidth, screenHeight, normalFactor);
          await sleep(100);
          await mouse.click(Button.RIGHT);
        } else {
          await mouse.click(Button.RIGHT);
        }
        break;
  
      case "middle_click":
        if (coordinates?.length === 1) {
          await moveTo(coordinates[0], screenWidth, screenHeight, normalFactor);
          await sleep(100);
          await mouse.click(Button.MIDDLE);
        } else {
          await mouse.click(Button.MIDDLE);
        }
        break;
  
      case "double_click":
        if (coordinates?.length === 1) {
          await moveTo(coordinates[0], screenWidth, screenHeight, normalFactor);
          await sleep(100);
          await mouse.doubleClick(Button.LEFT);
        } else {
          await mouse.doubleClick(Button.LEFT);
        }
        break;
  
      case "scroll":
        if (coordinates?.length === 2) {
          await moveTo(coordinates[0], screenWidth, screenHeight, normalFactor);
          await sleep(100);
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
        }
        break;
  
      case "wait":
        await sleep(3000);
        break;
    }
  }