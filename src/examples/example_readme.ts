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
    if (basename(filename) === arg1) return resolve({ [filename]: "success" });

    return reject(arg2);
  });
}

fileObjectWalker("./foo.txt", examplePayload, "foo.txt", 1)
  .then((retVal) => {
    console.log(retVal); // { '/home/mischback/fileobject-walker/foo.txt': 'success' }
  })
  .catch((err) => {
    console.log(err); // 1
  });
