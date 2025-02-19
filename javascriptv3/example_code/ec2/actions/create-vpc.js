// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// snippet-start:[ec2.JavaScript.vpcs.createVpcV3]
import { CreateVpcCommand, EC2Client } from "@aws-sdk/client-ec2";

/**
 * @param {{ cidrBlock: string }} options
 */
export const main = async ({ cidrBlock }) => {
  const client = new EC2Client({});
  const command = new CreateVpcCommand({
    CidrBlock: cidrBlock,
  });

  try {
    const { Vpc } = await client.send(command);
    console.log(Vpc);
    console.log("VPC ID: ", Vpc.VpcId);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "InvalidKeyPair.Duplicate") {
      console.warn(`${caught.message}. Try another key name.`);
    } else {
      throw caught;
    }
  }
};
// snippet-end:[ec2.JavaScript.vpcs.createVpcV3]

// Call function if run directly.
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const options = {
    cidrBlock: {
      type: "string",
      description: "",
    },
  };

  const { values } = parseArgs({ options });
  main(values);
}
