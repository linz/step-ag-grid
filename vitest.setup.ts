// vitest.setup.ts
import { JSDOM } from 'jsdom'

const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
global.document = dom.window.document;