// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  Scenario,
  ScenarioAction,
  ScenarioInput,
  ScenarioOutput,
  //} from "@aws-doc-sdk-examples/lib/scenario/index.js";
} from "../../../libs/scenario/index.js";
import {
  EC2Client,
  CreateVpcCommand,
  DescribeRouteTablesCommand,
  CreateVpcEndpointCommand,
  waitUntilVpcExists,
} from "@aws-sdk/client-ec2";
import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  CopyObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import {
  CloudFormationClient,
  CreateStackCommand,
  DeleteStackCommand,
  DescribeStacksCommand,
  waitUntilStackExists,
  waitUntilStackCreateComplete,
  waitUntilStackDeleteComplete,
} from "@aws-sdk/client-cloudformation";
import { IAMClient, CreateAccessKeyCommand } from "@aws-sdk/client-iam";
import { wait } from "@aws-doc-sdk-examples/lib/utils/util-timers.js";
import { parseArgs } from "node:util";
import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const stackName = "s3DirectoryBucketsBasicsStack";
const region = "us-east-1";

import data from "./names.json" with { type: "json" };

/**
 * @typedef {{
 *   ec2Client: import('@aws-sdk/client-ec2').EC2Client,
 *   s3Client: import('@aws-sdk/client-s3').S3Client,
 *   iamClient: import('@aws-sdk/client-iam').IAMClient,
 *   cloudFormationClient: import('@aws-sdk/client-cloudformation').CloudFormationClient,
 *   stackName,
 *   stack,
 *   askToDeleteResources: true,
 *   cidrBlock: {cidrBlockAddress: "10.0.0.0/16"},
 *   portal: {portalName: "MyPortal1"},
 *   gateway: {gatewayName: "MyGateway1"},
 *   propertyIds: [],
 *   contactEmail: "user@mydomain.com",
 *   thing: "MyThing1",
 *   sampleData: { temperature: 23.5, humidity: 65.0}
 * }} State
 */

/**
 * Used repeatedly to have the user press enter.
 * @type {ScenarioInput}
 */
const pressEnter = new ScenarioInput("continue", "Press Enter to continue", {
  type: "confirm",
});

const greet = new ScenarioOutput(
  "greet",
  `Let's get started! First, please note that S3 Express One Zone works best when working within the AWS infrastructure,
specifically when working in the same Availability Zone. To see the best results in this example, and when you implement
Directory buckets into your infrastructure, it is best to put your Compute resources in the same AZ as your Directory bucket.`,
  { header: true },
);
const displayCreateVpcAndVpcEndpoint = new ScenarioOutput(
  "displayCreateVpcAndVpcEndpoint",
  `1. If you are running this in an EC2 instance located in the same AZ as your intended Directory buckets, we'll set up a new VPC and VPC Endpoint.`,
);

const confirmIfUsingEc2Instance = new ScenarioInput(
  "confirmIfUsingEc2Instance",
  "Type 'Y' if you are running this examples on an EC2 instance and want to create a VPC, or press enter to skip this step: ",
  { type: "input", default: "" },
);

const sdkCreateCreateVpcAndVpcEndpoint = new ScenarioAction(
  "sdkCreateCreateVpcAndVpcEndpoint",
  async (/** @type {State} */ state) => {
    let createVPCResponse;
    let describeRouteTableResponse;
    let createEndPointResponse;
    try {
      createVPCResponse = await state.ec2Client.send(
        new CreateVpcCommand({
          CidrBlock: "10.0.0.0/16",
        }),
      );
      state.VpcId = createVPCResponse.Vpc.VpcId;
      console.log(`VPC successfully created. VPC ID: ${state.VpcId}`);
    } catch (caught) {
      if (caught.name === "ResourceAlreadyExistsException") {
        console.log(`The VPC ${state.VpcId} already exists.`);
        throw caught;
      }
      console.error(`${caught.message}`);
      throw caught;
    }
    try {
      describeRouteTableResponse = await state.ec2Client.send(
        new DescribeRouteTablesCommand({
          Filters: [{ Name: "vpc-id", Values: [state.VpcId] }],
        }),
      );
      state.RouteTableId =
        describeRouteTableResponse.RouteTables[0].RouteTableId;
      console.log("Route Table Id: ", state.RouteTableId);
    } catch (caught) {
      console.error(`${caught.message}`);
      throw caught;
    }
    try {
      const serviceName = `com.amazonaws.${region}.s3express`;
      createEndPointResponse = await state.ec2Client.send(
        new CreateVpcEndpointCommand({
          VpcId: state.VpcId,
          RouteTableIds: [state.RouteTableId],
          ServiceName: serviceName,
        }),
      );
      state.vpcEndPoint = createEndPointResponse.VpcEndpoint.DnsName;
      console.log(
        "Success VPC Endpoint created, with ID ",
        createEndPointResponse,
      );
    } catch (caught) {
      console.error(`${caught.message}`);
      throw caught;
    }
  },
  {
    skipWhen: (/** @type {State} */ state) =>
      state.confirmIfUsingEc2Instance === "",
  },
);

const displayBuildCloudFormationStack = new ScenarioOutput(
  "displayBuildCloudFormationStack",
  `2. Policies, users, and roles with CDK.
  
Now, we'll set up some policies, roles, and a user. This user will only have permissions to do S3 Express One Zone actions.`,
);

const sdkBuildCloudFormationStack = new ScenarioAction(
  "sdkBuildCloudFormationStack",
  async (/** @type {State} */ state) => {
    try {
      const data = readFileSync(
        `${__dirname}/../../../../../resources/cfn/s3_express_basics/s3_express_template.yml`,
        "utf8",
      );
      await state.cloudFormationClient.send(
        new CreateStackCommand({
          StackName: stackName,
          TemplateBody: data,
          Capabilities: ["CAPABILITY_IAM"],
        }),
      );
      await waitUntilStackExists(
        { client: state.cloudFormationClient },
        { StackName: stackName },
      );
      await waitUntilStackCreateComplete(
        { client: state.cloudFormationClient },
        { StackName: stackName },
      );
      const stack = await state.cloudFormationClient.send(
        new DescribeStacksCommand({
          StackName: stackName,
        }),
      );
      state.stack = stack.Stacks[0].Outputs;
      console.log(
        `The ARN of the IAM role for the Regular user is ${state.stack[0].OutputValue}`,
      );
      console.log(
        `The ARN of the IAM role for the Express user is ${state.stack[1].OutputValue}`,
      );
    } catch (caught) {
      console.error(caught.message);
      throw caught;
    }
  },
);

const displayCreateS3Clients = new ScenarioOutput(
  "displayCreateS3Clients",
  `3. Create an additional client using the credentials with S3 Express permissions.\n";
  This client is created with the credentials associated with the user account with the S3 Express policy attached, so it can perform S3 Express operations.`,
);

const sdkCreateS3Clients = new ScenarioAction(
  "sdkCreateS3Clients",
  async (/** @type {State} */ state) => {
    let createRegularClientResponse;
    let createExpressClientResponse;
    const iamClient = new IAMClient({});
    try {
      createRegularClientResponse = await iamClient.send(
        new CreateAccessKeyCommand({
          UserName: `${state.stack[0].OutputValue}`,
        }),
      );
      console.log("createRegularClientResponse", createRegularClientResponse);
      state.regAccessKeyId = createRegularClientResponse.AccessKey.AccessKeyId;
      state.regSecretAccessKey =
        createRegularClientResponse.AccessKey.SecretAccessKey;
      console.log(
        `Regular user access key: ${state.regAccessKeyId}
        Regular use secret access key: ${state.regSecretAccessKey}`,
      );
    } catch (err) {
      console.log("Error", err);
    }
    try {
      const createExpressClientResponse = await iamClient.send(
        new CreateAccessKeyCommand({
          UserName: `${state.stack[1].OutputValue}`,
        }),
      );
      console.log("createExpressClientResponse", createExpressClientResponse);

      state.expAccessKeyId = createExpressClientResponse.AccessKey.AccessKeyId;
      state.expSecretAccessKey =
        createExpressClientResponse.AccessKey.SecretAccessKey;
      console.log(
        `Express user access key: ${state.expAccessKeyId}
        Express use secret access key: ${state.expSecretAccessKey}`,
      );
    } catch {
      console.log("Error");
    }
  },
);

const displayCreateS3Buckets = new ScenarioOutput(
  "displayCreateS3Buckets",
  `4. Create two buckets.
  Now we will create a Directory bucket which is the linchpin of the S3 Express One Zone service. Directory buckets 
behave in different ways from regular S3 buckets which we will explore here. We'll also create a normal bucket, put 
an object into the normal bucket, and copy it over to the Directory bucket.`,
);

const sdkCreateS3Buckets = new ScenarioAction(
  "sdkCreateS3Buckets",
  async (/** @type {State} */ state) => {
    /*    const s3regClient = new S3Client({
              region: region,
      credentials: {
        accessKeyId: `${state.regAccessKeyId}`,
        secretAccessKey: `${state.regSecretAccessKey}`,
      },
    });

    const s3expClient = new S3Client({
      region: region,
        credentials: {
        accessKeyId: `${state.expAccessKeyId}`,
        secretAccessKey: `${state.expSecretAccessKey}`
      },
    });*/
    const s3Client = new S3Client({});

    try {
      // Optionally edit the default key name prefix of the copied object in ./names.json.
      const regBucketNamePrefix = data.names.regbucketname;
      const regBucket = "regular-bucket";
      state.regularBucketName = `${regBucketNamePrefix}${regBucket}`;

      const createBucketwithRegularClient = await s3Client.send(
        new CreateBucketCommand({
          Bucket: `${state.regularBucketName}`,
          credentials: {
            accessKeyId: `${state.regAccessKeyId}`,
            secretAccessKey: `${state.regSecretAccessKey}`,
          },
        }),
      );
      state.regularBucketLocation = createBucketwithRegularClient.Location;
      console.log(
        `Bucket ${state.regularBucketName} created at ${state.regularBucketLocation}`,
      );
    } catch (caught) {
      console.error(caught.message);
      throw caught;
    }
    try {
      // Optionally edit the default key name prefix of the copied object in ./names.json.
      const expBucketNamePrefix = data.names.expbucketname;
      const expBucket = "express-bucket";
      state.expressBucketName = `${expBucketNamePrefix}${expBucket}`;

      const createBucketwithExpressClient = await s3Client.send(
        new CreateBucketCommand({
          Bucket: `${state.expressBucketName}`,
          credentials: {
            accessKeyId: `${state.expAccessKeyId}`,
            secretAccessKey: `${state.expSecretAccessKey}`,
          },
        }),
      );
      state.expressBucketLocation = createBucketwithExpressClient.Location;

      console.log(
        `Bucket ${state.expressBucketName} created at ${createBucketwithExpressClient.Location}`,
      );
    } catch (caught) {
      console.error(caught.message);
      throw caught;
    }
  },
);

const displayCreateAndCopyObject = new ScenarioOutput(
  "displayCreateAndCopyObject",
  `5. Create an object and copy it over.
We'll create a basic object consisting of some text and upload it to the normal bucket.
Next, we'll copy the object into the Directory bucket using the regular client.
This works fine, because Copy operations are not restricted for Directory buckets.
It's important to remember the user permissions when interacting with Directory buckets.
Instead of validating permissions on every call as normal buckets do, Directory buckets utilize the user credentials and session token to validate.
This allows for much faster connection speeds on every call. For single calls, this is low, but for many concurrent calls, this adds up to a lot of time saved.`,
);

const sdkCreateAndCopyObject = new ScenarioAction(
  "sdkCreateAndCopyObject",
  async (state) => {
    const filePath = path.join(__dirname, "text01.txt");

    // Optionally edit the default key name prefix of the copied object in ./names.json.
    const keyNamePrefix = data.names.keyname;
    const keyName = "file01.txt";
    const keyNameFinal = `${keyNamePrefix}${keyName}`;
    /*    const s3regClient = new S3Client({
      credentials: {
        accessKeyId: `${state.regAccessKeyId}`,
        secretAccessKey: `${state.regSecretAccessKey}`,
      },
    });

    const s3expClient = new S3Client({
      credentials: {
        accessKeyId: `${state.expAccessKeyId}`,
        secretAccessKey: `${state.expSecretAccessKey}`,
      },
    });*/
    const s3Client = new S3Client({});

    try {
      const putObjectInRegularBucket = await s3Client.send(
        new PutObjectCommand({
          Bucket: `${state.regularBucketName}`,
          Key: keyNameFinal,
          Body: await readFile(filePath),
          credentials: {
            accessKeyId: `${state.regAccessKeyId}`,
            secretAccessKey: `${state.regSecretAccessKey}`,
          },
        }),
      );
      console.log(
        `Created ${keyNamePrefix}${keyName} in ${state.regularBucketName}`,
      );
      state.objectNameInRegularBucket = `${keyNamePrefix}${keyName}`;
    } catch (err) {
      console.log("Error ", err);
    }
    try {
      const copySource = `${state.regularBucketName}/${keyNamePrefix}${keyName}`;
      const copiedKey = `${keyNamePrefix}${keyName}`;

      const copyObjectToExpressBucket = await s3Client.send(
        new CopyObjectCommand({
          CopySource: copySource,
          Bucket: `${state.expressBucketName}`,
          Key: copiedKey,
          credentials: {
            accessKeyId: `${state.expAccessKeyId}`,
            secretAccessKey: `${state.expSecretAccessKey}`,
          },
        }),
      );
      state.objectNameInExpressBucket = `${keyNamePrefix}${keyName}`;
      console.log(
        `Copied ${keyNamePrefix}${keyName} from ${state.regularBucketName} to ${state.expressBucketName}.`,
      );
    } catch (err) {
      console.log("Error ", err);
    }
  },
);

const displayGetObjectfromBothBuckets = new ScenarioOutput(
  "displayGetObjectfromBothBuckets",
  `6. Demonstrate performance difference.
Now, let's do a performance test. We'll download the same object from each bucket 1000 times 
and compare the total time needed. Note: the performance difference will be much more pronounced 
if this example is run in an EC2 instance in the same AZ as the bucket.`,
);

const sdkGetObjectfromBothBuckets = new ScenarioAction(
  "sdkGetObjectfromBothBuckets",
  async (/** @type {State} */ state) => {
    /*    const s3regClient = new S3Client({
      credentials: {
        accessKeyId: `${state.regAccessKeyId}`,
        secretAccessKey: `${state.regSecretAccessKey}`,
      },
    });

    const s3expClient = new S3Client({
      credentials: {
        accessKeyId: `${state.expAccessKeyId}`,
        secretAccessKey: `${state.expSecretAccessKey}`,
      },
    });*/
    const s3Client = new S3Client({});
    try {
      async function runExpressLoop() {
        await getObjectfromExpressBucket1000();
      }

      async function getObjectfromExpressBucket() {
        const command = new GetObjectCommand({
          Bucket: `${state.expressBucketName}`,
          Key: `${state.objectNameInExpressBucket}`,
          credentials: {
            accessKeyId: `${state.expAccessKeyId}`,
            secretAccessKey: `${state.expSecretAccessKey}`,
          },
        });
        const response = await s3Client.send(command);
      }

      async function getObjectfromExpressBucket1000() {
        const startTimeExpBucket = Date.now();
        console.log("startTimeExpBucket", startTimeExpBucket);
        for (let i = 0; i < 1000; i++) {
          getObjectfromExpressBucket();
        }
        const endTimeExpBucket = Date.now();
        const downloadTimeExpBucket = startTimeExpBucket - endTimeExpBucket;
        state.downloadTimefromExpressBucket = downloadTimeExpBucket;
        console.log(
          `The download time from the express bucket was ${state.downloadTimefromExpressBucket} milliseconds`,
        );
      }
      runExpressLoop();
    } catch (err) {
      console.log("error in express loop", err);
    }
    try {
      async function runRegularLoop() {
        await getObjectfromRegularBucket1000();
      }

      async function getObjectfromRegularBucket() {
        const command = new GetObjectCommand({
          Bucket: `${state.regularBucketName}`,
          Key: `${state.objectNameInRegularBucket}`,
          credentials: {
            accessKeyId: `${state.regAccessKeyId}`,
            secretAccessKey: `${state.regSecretAccessKey}`,
          },
        });
        const response = await s3Client.send(command);
      }

      async function getObjectfromRegularBucket1000() {
        const startTimeRegBucket = Date.now();
        console.log("startTimeRegBucket", startTimeRegBucket);
        for (let i = 0; i < 1000; i++) {
          getObjectfromRegularBucket();
        }
        const endTimeRegBucket = Date.now();
        const downloadTimeRegBucket = startTimeRegBucket - endTimeRegBucket;
        state.downloadTimefromRegularBucket = downloadTimeRegBucket;
        console.log(
          `The download time from the regular bucket was ${state.downloadTimefromRegularBucket} milliseconds.`,
        );
        const timedifference =
          state.downloadTimefromRegularBucket -
          state.downloadTimefromExpressBucket;
        console.log(`The time difference is ${timedifference} milliseconds.`);
      }
      runRegularLoop();
    } catch (err) {
      console.log("error in loop", err);
    }
  },
);

const goodbye = new ScenarioOutput(
  "goodbye",
  "This concludes the IoT Sitewise Basics scenario for the AWS Javascript SDK v3. Thank you!",
);

const myScenario = new Scenario(
  "IoTSiteWise Basics",
  [
    greet,
    pressEnter,
    displayCreateVpcAndVpcEndpoint,
    pressEnter,
    confirmIfUsingEc2Instance,
    sdkCreateCreateVpcAndVpcEndpoint,
    pressEnter,
    displayBuildCloudFormationStack,
    sdkBuildCloudFormationStack,
    displayCreateS3Clients,
    pressEnter,
    sdkCreateS3Clients,
    pressEnter,
    displayCreateS3Buckets,
    pressEnter,
    sdkCreateS3Buckets,
    pressEnter,
    displayCreateAndCopyObject,
    pressEnter,
    sdkCreateAndCopyObject,
    pressEnter,
    displayGetObjectfromBothBuckets,
    pressEnter,
    sdkGetObjectfromBothBuckets,
    pressEnter,
    goodbye,
  ],
  {
    ec2Client: new EC2Client({ region: region }),
    iamClient: new IAMClient({ region: region }),
    s3Client: new S3Client({ region: region }),
    cloudFormationClient: new CloudFormationClient({ region: region }),
    vpcEndPoint: {},
    regAccessKeyId: {},
    expAccessKeyId: {},
    regSecretAccessKey: {},
    expSecretAccessKey: {},
    regularBucketName: {},
    expressBucketName: {},
    regularBucketLocation: {},
    expressBucketLocation: {},
    objectNameInRegularBucket: {},
    objectNameInExpressBucket: {},
    downloadTimefromRegularBucket: {},
    downloadTimefromExpressBucket: {},
  },
);

/** @type {{ stepHandlerOptions: StepHandlerOptions }} */
export const main = async (stepHandlerOptions) => {
  await myScenario.run(stepHandlerOptions);
};

// Invoke main function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: {
      yes: {
        type: "boolean",
        short: "y",
      },
    },
  });
  main({ confirmAll: values.yes });
}
