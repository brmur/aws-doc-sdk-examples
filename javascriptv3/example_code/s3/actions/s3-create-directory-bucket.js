// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// snippet-start:[s3.JavaScript.buckets.createBucketV3]
import {
  BucketAlreadyExists,
  BucketAlreadyOwnedByYou,
  CreateBucketCommand,
  S3Client,
  waitUntilBucketExists,
} from "@aws-sdk/client-s3";

/**
 * Create an Amazon S3 bucket.
 * @param {{ bucketName: string }} config
 */
export const main = async ({ bucketName }) => {
  try {
    const region = "us-east-1";
    const s3Client = new S3Client({
      region,
    });
    const zone = "use1-az6";
    const suffix = `${zone}--x-s3`;

    console.log("bucketName ", bucketName);

    const { Location } = await s3Client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
        CreateBucketConfiguration: {
          Location: { Type: "AvailabilityZone", Name: zone },
          Bucket: {
            Type: "Directory",
            DataRedundancy: "SingleAvailabilityZone",
          },
        },
      }),
    );
    await waitUntilBucketExists({ s3Client }, { Bucket: bucketName });
    console.log(`Bucket created with location ${Location}`);
  } catch (err) {
    console.error(`Error ${err.name}${err.message}`);
  }
  /*    // WARNING: If you try to create a bucket in the North Virginia region,
    // and you already own a bucket in that region with the same name, this
    // error will not be thrown. Instead, the call will return successfully
    // and the ACL on that bucket will be reset.
    else if (caught instanceof BucketAlreadyOwnedByYou) {
      console.error(
        `The bucket "${bucketName}" already exists in this AWS account.`,
      );
    } else {
      throw caught;
    }*/
};
// snippet-end:[s3.JavaScript.buckets.createBucketV3]

// Call function if run directly
import { parseArgs } from "node:util";
import {
  isMain,
  validateArgs,
} from "@aws-doc-sdk-examples/lib/utils/util-node.js";

const loadArgs = () => {
  const options = {
    bucketName: {
      type: "string",
      required: true,
    },
  };
  const results = parseArgs({ options });
  const { errors } = validateArgs({ options }, results);
  return { errors, results };
};

if (isMain(import.meta.url)) {
  const { errors, results } = loadArgs();
  if (!errors) {
    main(results.values);
  } else {
    console.error(errors.join("\n"));
  }
}
