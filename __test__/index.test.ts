/*
 * Copyright 2022 Google LLC
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

import expect from "expect";
import { describe } from "mocha";
import { run } from "../src";
import { SetupActionEnvironmentFromArgv } from "./test_util";

describe("Main Test", function () {
  SetupActionEnvironmentFromArgv();
  const promise = run();

  it("should return a promise", function () {
    expect(promise).toBeInstanceOf(Promise);
  });
});
