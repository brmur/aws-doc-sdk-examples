// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { describe, it } from "vitest";
import { main } from "../actions/describe-route-tables.js";
describe("test create-key-pair", () => {
  it(
    "should not re-throw service exceptions",
    async () => {
      await main({
        Filters: [{ Name: "vpc-id", Values: ["vpc-0e1beae6140b8333d"] }],
      });
    },
    { timeout: 600000 },
  );
});
