/*
 * Copyright 2024 Imamuzzaki Abu Salam
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as core from "@actions/core";
import * as github from "@actions/github";
import * as http from "@actions/http-client";
import { HttpClientResponse } from "@actions/http-client";
import expect from "expect";
import fs from "fs";
import { afterEach } from "mocha";
import sinon from "sinon";
import { Config } from "../src/config";
import { COVERAGE_SVG } from "../src/constants";
import { evaluateNumber, evaluateString, generateBadge } from "../src/utils";

describe("utils.ts", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("evaluateString", () => {
    it("should return the input string when provided", () => {
      sinon.stub(core, "getInput").returns("inputString");
      const result = evaluateString("testInput", "fallback");
      expect(result).toEqual("inputString");
    });

    it("should return the fallback when input is empty", () => {
      sinon.stub(core, "getInput").returns("");
      const result = evaluateString("testInput", "fallback");
      expect(result).toEqual("fallback");
    });

    it("should return the fallback when input is undefined", () => {
      // @ts-expect-error - Testing undefined input
      sinon.stub(core, "getInput").returns(undefined);
      const result = evaluateString("testInput", "fallback");
      expect(result).toEqual("fallback");
    });
  });

  describe("evaluateNumber", () => {
    it("should return the input number when valid", () => {
      sinon.stub(core, "getInput").returns("42");
      const result = evaluateNumber("testInput", 0);
      expect(result).toEqual(42);
    });

    it("should return the fallback when input is not a valid number", () => {
      sinon.stub(core, "getInput").returns("not-a-number");
      const result = evaluateNumber("testInput", 0);
      expect(result).toEqual(0);
    });

    it("should return the fallback when input is out of range", () => {
      sinon.stub(core, "getInput").returns("200");
      const result = evaluateNumber("testInput", 0);
      expect(result).toEqual(0);
    });
  });

  describe("generateBadge", () => {
    it.skip("should create a badge file and write it to GitHub", async () => {
      const mockConfig: Config = { accessToken: "mockToken" };

      // Mock the HTTP client
      const httpClientGetStub = sinon
        .stub(http.HttpClient.prototype, "get")
        .resolves({
          readBody: () => Promise.resolve("badgeContent"),
        } as HttpClientResponse);

      // Mock the fs.writeFile method
      const fsWriteFileStub = sinon.stub(fs, "writeFile").yields(null);

      // Mock GitHub Octokit
      const octokitStub = sinon.stub(github, "getOctokit").returns({
        rest: {
          repos: {
            getContent: sinon.stub().resolves({
              data: { sha: "mockSha" },
            }),
            createOrUpdateFileContents: sinon.stub().resolves({}),
          },
        },
      });

      await generateBadge(mockConfig, "https://mock.badge.url");

      // Check if the HTTP request was made
      expect(httpClientGetStub.calledOnce).toEqual(true);

      // Check if the file was written
      expect(fsWriteFileStub.calledOnce).toEqual(true);
      expect(fsWriteFileStub.args[0][0]).toEqual(COVERAGE_SVG);

      // Check if GitHub API was called
      const octokit = github.getOctokit(mockConfig.accessToken);
      expect(octokit.rest.repos.createOrUpdateFileContents.calledOnce).toEqual(
        true
      );

      // Restore the stubs
      httpClientGetStub.restore();
      fsWriteFileStub.restore();
      octokitStub.restore();
    });

    it.skip("should handle error when writing to file", async () => {
      const mockConfig: Config = { accessToken: "mockToken" };

      // Mock the HTTP client
      const httpClientGetStub = sinon
        .stub(http.HttpClient.prototype, "get")
        .resolves({
          readBody: () => Promise.resolve("badgeContent"),
        } as HttpClientResponse);

      // Mock fs.writeFile to simulate error
      const fsWriteFileStub = sinon
        .stub(fs, "writeFile")
        .yields(new Error("Write error"));

      // Mock GitHub Octokit
      const octokitStub = sinon.stub(github, "getOctokit").returns({
        rest: {
          repos: {
            getContent: sinon.stub().resolves({
              data: { sha: "mockSha" },
            }),
            createOrUpdateFileContents: sinon.stub().resolves({}),
          },
        },
      });

      await generateBadge(mockConfig, "https://mock.badge.url");

      // Check if error handling happens
      expect(fsWriteFileStub.calledOnce).toEqual(true);

      // Restore the stubs
      httpClientGetStub.restore();
      fsWriteFileStub.restore();
      octokitStub.restore();
    });
  });
});
