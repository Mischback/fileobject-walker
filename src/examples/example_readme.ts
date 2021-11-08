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
