// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { describe, it } from "vitest";
import { main } from "../actions/s3-create-directory-bucket.js";
describe("test s3-create-directory-bucket", () => {
  it(
    "should not re-throw service exceptions",
    async () => {
      await main({
        Bucket: "amzn-s3-demo-bucket",
        CreateBucketConfiguration: {
          Location: { Type: "AvailabilityZone", Name: "use1-az4" },
          Bucket: {
            Type: "Directory",
            DataRedundancy: "SingleAvailabilityZone",
          },
        },
      });
    },
    { timeout: 600000 },
  );
});
