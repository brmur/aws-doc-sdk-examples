// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// snippet-start:[ec2.JavaScript.vpcs.describeRouteTablesV3]
import { DescribeRouteTablesCommand, EC2Client } from "@aws-sdk/client-ec2";

/**
 * @param {{ vpcId: string }} options
 */
export const main = async () => {
  const client = new EC2Client({});
  const command = new DescribeRouteTablesCommand({
    Filters: [{ Name: "vpc-id", Values: ["vpc-0e1beae6140b8333d"] }],
  });

  try {
    const { RouteTables } = await client.send(command);
    console.log("VpcID: ", RouteTables[0].VpcId);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "InvalidKeyPair.Duplicate") {
      console.warn(`${caught.message}. Try another key name.`);
    } else {
      throw caught;
    }
  }
};
// snippet-end:[ec2.JavaScript.vpcs.describeRouteTablesV3]

// Call function if run directly.
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const options = {
    vpcId: {
      type: "string",
      description: "",
    },
  };

  const { values } = parseArgs({ options });
  main(values);
}
