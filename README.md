# TS Type Guard Generator

## Usage
- Select the entirety of an interface defintiion.
- Open your command palette
- Run the command `Type Guard Generator`
- If everything was okay, the command should generate code at the bottom of your file.
- Import the proper functions

## Running

- Run `npm install` in terminal to install dependencies
- Run the `Run Extension` target in the Debug View. This will:
	- Start a task `npm: watch` to compile the code
	- Run the extension in a new VS Code window

## Required supporting code
To use the generated code you'll need to have all the code below in your project.

type-guard.util.ts
```
interface PlainObject {
  // Object.hasOwn() is intended as a replacement for Object.hasOwnProperty(). See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
  hasOwn<K extends string>(key: K): this is Record<K, unknown>
}

export function isPlainObject(value: unknown): value is PlainObject {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}

export function isString(value: unknown): value is string {
  return typeof value === "string"
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number"
}

export function isBooleanArray(value: unknown): value is boolean[] {
  if (!Array.isArray(value)) return false
  for (const item of value) {
    if (!isBoolean(item)) {
      return false
    }
  }
  return true
}

export function isStringArray(value: unknown): value is string[] {
  if (!Array.isArray(value)) return false
  for (const item of value) {
    if (!isString(item)) {
      return false
    }
  }
  return true
}

export function isNumberArray(value: unknown): value is number[] {
  if (!Array.isArray(value)) return false
  for (const item of value) {
    if (!isNumber(item)) {
      return false
    }
  }
  return true
}
```

import statements
```
import {
  isPlainObject,
  isBoolean,
  isString,
  isNumber,
  isBooleanArray,
  isStringArray,
  isNumberArray,
} from "./type-guard.util"
```