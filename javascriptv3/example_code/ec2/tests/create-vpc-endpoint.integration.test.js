// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { describe, it } from "vitest";
import { main } from "../actions/create-vpc-endpoint.js";
describe("test create-key-pair", () => {
  it(
    "should not re-throw service exceptions",
    async () => {
      await main({
        vpcId: "vpc-0dfcf21dc0ed89c37",
        routeTableIds: "myroutetableid",
        serviceName: "com.amazonaws.us-east-1.s3express",
      });
    },
    { timeout: 600000 },
  );
});
