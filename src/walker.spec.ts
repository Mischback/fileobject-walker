// SPDX-License-Identifier: MIT

/* test specific imports */
import { describe, expect, it, jest } from "@jest/globals";

/* mock library imports */
jest.mock("fs/promises");
jest.mock("path");

/* import the subject under test (SUT) */
// import { fileObjectWalker, FileObjectWalkerError } from "./walker";

/* additional imports */
// import { readdir, stat } from "fs/promises";
// import { resolve } from "path";

describe("fileObjectWalker()...", () => {
  it("...rejects with a FileObjectWalkerError if stat() fails", () => {
    expect(1).toBe(1);
  });
  it("...rejects with a FileObjectWalkerError if readdir() fails", () => {
    expect(1).toBe(1);
  });
});
