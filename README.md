# fileobject-walker

![npm (scoped)](https://img.shields.io/npm/v/@mischback/fileobject-walker?style=flat)

![GitHub package.json version (development)](https://img.shields.io/github/package-json/v/mischback/fileobject-walker/development?style=flat)
![GitHub branch checks state](https://img.shields.io/github/workflow/status/mischback/fileobject-walker/CI%20default%20branch?style=flat&logo=github)
[![Coverage Status](https://coveralls.io/repos/github/Mischback/fileobject-walker/badge.svg)](https://coveralls.io/github/Mischback/fileobject-walker)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat&logo=prettier)](https://github.com/prettier/prettier)
![GitHub License](https://img.shields.io/github/license/mischback/fileobject-walker?style=flat)

Walk fileobjects recursively and apply a provided payload to them.

## Installation

Just install from **npm**:

```bash
npm install @mischback/fileobject-walker
```

## Usage

The `fileObjectWalker()` accepts two mandatory and unlimited optional parameters.

- `startingPoint`: A file or directory (provided as string) as starting point of
  the walker. If specified as a relative path, the function will resolve it
  (make it absolute) with the current working directory of your Node process as
  root.
- `payload`: The function to execute on files. The function must accept a
  filename, specified as string, as its first parameter. It may accept more
  parameters for its internal control flow (see below). The function is expected
  to work _Promise-based_.
- any parameter provided after `payload` are considered parameters for the
  provided `payload` function and are passed on when executing the `payload`.

See the following application in _TypeScript_. Please note, that the parameters
passed to `payload` are of type `unknown` and must be cast to their original
type inside of the `payload` function.

```TypeScript
import { fileObjectWalker } from "../walker";
import { basename } from "path";

function examplePayload(
  filename: string,
  payloadArg1: unknown,
  payloadArg2: unknown
): Promise<{ [key: string]: string }> {
  const arg1 = payloadArg1 as string;
  const arg2 = payloadArg2 as number;

  return new Promise((resolve, reject) => {
    if (basename(filename) !== arg1) return resolve({ [filename]: "skipped" });

    return reject(arg2);
  });
}

fileObjectWalker("./", examplePayload, "foo.txt", 1337)
  .then((retVal) => {
    // produces a long list of files if there is no "foo.txt" in your current
    // working directory or any of its subfolders
    console.log(retVal);
  })
  .catch((err) => {
    // 1337 if there is a "foo.txt" in your current working directory or any of
    //  its subfolders
    console.log(err);
  });
```
