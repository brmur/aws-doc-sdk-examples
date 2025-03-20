// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { describe, it } from "vitest";
import { main } from "../actions/create-key-pair.js";
describe("test create-key-pair", () => {
  it(
    "should not re-throw service exceptions",
    async () => {
      await main({
        keyName: "mykeyname",
      });
    },
    { timeout: 600000 },
  );
});
