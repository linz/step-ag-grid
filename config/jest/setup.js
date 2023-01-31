import "@testing-library/jest-dom";
import "jest-canvas-mock";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
