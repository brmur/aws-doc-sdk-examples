// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// snippet-start:[ec2.JavaScript.vpcs.createVpcV3]
import { CreateVpcEndpointCommand, EC2Client } from "@aws-sdk/client-ec2";

/**
 * @param {{ vpcId: string, routeTablesId: string, serviceName: string }} options
 */
export const main = async ({ vpcId, routeTablesId, serviceName }) => {
  const client = new EC2Client({});
  const command = new CreateVpcEndpointCommand({
    VpcId: vpcId,
    RouteTableIds: routeTablesId,
    ServiceName: serviceName,
  });

  try {
    const { Vpc } = await client.send(command);
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
    vpcId: {
      type: "string",
      description: "",
    },
    routeTablesId: {
      type: "string",
      description: "",
    },
    serviceName: {
      type: "string",
      description: "",
    },
  };

  const { values } = parseArgs({ options });
  main(values);
}
