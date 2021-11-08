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

  it("...resolves with the payload result if called on a file", () => {
    /* define the parameter */
    const testPayloadReturn = "success";
    const testStartingPoint = "testEntryPoint";
    const testStatObject = new Stats();
    testStatObject.isDirectory = () => {
      return false;
    };
    const testPayload = (
      _startingPoint: string,
      _payloadConfig: unknown
    ): Promise<string> => {
      return Promise.resolve(testPayloadReturn);
    };

    /* setup mocks and spies */
    (resolve as jest.Mock).mockReturnValue(testStartingPoint);
    (stat as jest.Mock).mockResolvedValue(testStatObject);

    /* make the assertions */
    return fileObjectWalker(testStartingPoint, testPayload).then(
      (retVal: string) => {
        expect(retVal).toBe(testPayloadReturn);
        expect(readdir).toHaveBeenCalledTimes(0);
      }
    );
  });

  it("...rejects with the rejection of the payload if called on a file", () => {
    /* define the parameter */
    const testRejection = "testRejection";
    const testStartingPoint = "testEntryPoint";
    const testStatObject = new Stats();
    testStatObject.isDirectory = () => {
      return false;
    };
    const testPayload = (
      _startingPoint: string,
      _payloadConfig: unknown
    ): Promise<string> => {
      return Promise.reject(new Error(testRejection));
    };

    /* setup mocks and spies */
    (resolve as jest.Mock).mockReturnValue(testStartingPoint);
    (stat as jest.Mock).mockResolvedValue(testStatObject);

    /* make the assertions */
    return fileObjectWalker(testStartingPoint, testPayload).catch(
      (err: Error) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(testRejection);
      }
    );
  });

  it("...calls the payload with any number of provided arguments", () => {
    /* define the parameter */
    const testPayloadParam1 = "param1";
    const testPayloadParam2 = 1337;
    const testRejection = "testRejection";
    const testStartingPoint = "testEntryPoint";
    const testStatObject = new Stats();
    testStatObject.isDirectory = () => {
      return false;
    };
    const testPayload = jest.fn(
      (_startingPoint: string, ..._payloadConfig: unknown[]) => {
        return Promise.reject(new Error(testRejection));
      }
    );

    /* setup mocks and spies */
    (resolve as jest.Mock).mockReturnValue(testStartingPoint);
    (stat as jest.Mock).mockResolvedValue(testStatObject);

    /* make the assertions */
    return fileObjectWalker(
      testStartingPoint,
      testPayload,
      testPayloadParam1,
      testPayloadParam2
    ).catch((err: Error) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe(testRejection);
      expect(testPayload).toBeCalledTimes(1);
      expect(testPayload).toHaveBeenCalledWith(
        testStartingPoint,
        testPayloadParam1,
        testPayloadParam2
      );
    });
  });
});
