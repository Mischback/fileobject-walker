// SPDX-License-Identifier: MIT

/* test specific imports */
import { describe, expect, it, jest } from "@jest/globals";

/* mock library imports */
jest.mock("fs/promises");
jest.mock("path");

/* import the subject under test (SUT) */
import { fileObjectWalker, FileObjectWalkerError } from "./walker";

/* additional imports */
import { Stats } from "fs";
import { readdir, stat } from "fs/promises";
import { resolve } from "path";

describe("fileObjectWalker()...", () => {
  it("...rejects with a FileObjectWalkerError if stat() fails", () => {
    /* define the parameter */
    const testRejection = "foobar";
    const testStartingPoint = "testEntryPoint";
    const testPayload = (
      _startingPoint: string,
      _payloadConfig: unknown
    ): Promise<void> => {
      return Promise.resolve();
    };

    /* setup mocks and spies */
    (resolve as jest.Mock).mockReturnValue(testStartingPoint);
    (stat as jest.Mock).mockRejectedValue(testRejection);

    /* make the assertions */
    return fileObjectWalker(testStartingPoint, testPayload).catch(
      (err: FileObjectWalkerError) => {
        expect(err).toBeInstanceOf(FileObjectWalkerError);
        expect(err.message).toBe(`Could not stat() "${testStartingPoint}"`);
        expect(err.originalError).toBe(testRejection);
      }
    );
  });

  it("...rejects with a FileObjectWalkerError if readdir() fails", () => {
    /* define the parameter */
    const testRejection = "foobar";
    const testStartingPoint = "testEntryPoint";
    const testStatObject = new Stats();
    testStatObject.isDirectory = () => {
      return true;
    };
    const testPayload = (
      _startingPoint: string,
      _payloadConfig: unknown
    ): Promise<void> => {
      return Promise.resolve();
    };

    /* setup mocks and spies */
    (resolve as jest.Mock).mockReturnValue(testStartingPoint);
    (stat as jest.Mock).mockResolvedValue(testStatObject);
    (readdir as jest.Mock).mockRejectedValue(testRejection);

    /* make the assertions */
    return fileObjectWalker(testStartingPoint, testPayload).catch(
      (err: FileObjectWalkerError) => {
        expect(err).toBeInstanceOf(FileObjectWalkerError);
        expect(err.message).toBe(`Could not readdir() "${testStartingPoint}"`);
        expect(err.originalError).toBe(testRejection);
      }
    );
  });
});
