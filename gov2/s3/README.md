# Amazon S3 code examples for the SDK for Go V2

## Overview

Shows how to use the AWS SDK for Go V2 to work with Amazon Simple Storage Service (Amazon S3).

<!--custom.overview.start-->
<!--custom.overview.end-->

_Amazon S3 is storage for the internet. You can use Amazon S3 to store and retrieve any amount of data at any time, from anywhere on the web._

## ⚠ Important

* Running this code might result in charges to your AWS account. For more details, see [AWS Pricing](https://aws.amazon.com/pricing/) and [Free Tier](https://aws.amazon.com/free/).
* Running the tests might result in charges to your AWS account.
* We recommend that you grant your code least privilege. At most, grant only the minimum permissions required to perform the task. For more information, see [Grant least privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).
* This code is not tested in every AWS Region. For more information, see [AWS Regional Services](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services).

<!--custom.important.start-->
<!--custom.important.end-->

## Code examples

### Prerequisites

For prerequisites, see the [README](../README.md#Prerequisites) in the `gov2` folder.


<!--custom.prerequisites.start-->
<!--custom.prerequisites.end-->

### Get started

- [Hello Amazon S3](hello/hello.go#L4) (`ListBuckets`)


### Basics

Code examples that show you how to perform the essential operations within a service.

- [Learn the basics](actions/bucket_basics.go)


### Single actions

Code excerpts that show you how to call individual service functions.

- [CopyObject](actions/bucket_basics.go#L288)
- [CreateBucket](actions/bucket_basics.go#L94)
- [DeleteBucket](actions/bucket_basics.go#L387)
- [DeleteObject](../workflows/s3_object_lock/actions/s3_actions.go#L365)
- [DeleteObjects](../workflows/s3_object_lock/actions/s3_actions.go#L413)
- [GetObject](actions/bucket_basics.go#L200)
- [GetObjectLegalHold](../workflows/s3_object_lock/actions/s3_actions.go#L72)
- [GetObjectLockConfiguration](../workflows/s3_object_lock/actions/s3_actions.go#L109)
- [GetObjectRetention](../workflows/s3_object_lock/actions/s3_actions.go#L138)
- [HeadBucket](actions/bucket_basics.go#L64)
- [ListBuckets](actions/bucket_basics.go#L36)
- [ListObjectVersions](../workflows/s3_object_lock/actions/s3_actions.go#L338)
- [ListObjectsV2](actions/bucket_basics.go#L316)
- [PutObject](actions/bucket_basics.go#L126)
- [PutObjectLegalHold](../workflows/s3_object_lock/actions/s3_actions.go#L173)
- [PutObjectLockConfiguration](../workflows/s3_object_lock/actions/s3_actions.go#L234)
- [PutObjectRetention](../workflows/s3_object_lock/actions/s3_actions.go#L276)

### Scenarios

Code examples that show you how to accomplish a specific task by calling multiple
functions within the same service.

- [Create a presigned URL](actions/presigner.go)
- [Lock Amazon S3 objects](../workflows/s3_object_lock/workflows/s3_object_lock.go)
- [Upload or download large files](actions/bucket_basics.go)


<!--custom.examples.start-->
<!--custom.examples.end-->

## Run the examples

### Instructions


<!--custom.instructions.start-->
<!--custom.instructions.end-->

#### Hello Amazon S3

This example shows you how to get started using Amazon S3.

```
go run ./hello
```

#### Run a scenario

All scenarios can be run with the `cmd` runner. To get a list of scenarios
and to get help for running a scenario, use the following command:

```
go run ./cmd -h
```
#### Learn the basics

This example shows you how to do the following:

- Create a bucket and upload a file to it.
- Download an object from a bucket.
- Copy an object to a subfolder in a bucket.
- List the objects in a bucket.
- Delete the bucket objects and the bucket.

<!--custom.basic_prereqs.s3_Scenario_GettingStarted.start-->
<!--custom.basic_prereqs.s3_Scenario_GettingStarted.end-->


<!--custom.basics.s3_Scenario_GettingStarted.start-->
<!--custom.basics.s3_Scenario_GettingStarted.end-->


#### Create a presigned URL

This example shows you how to create a presigned URL for Amazon S3 and upload an object.


<!--custom.scenario_prereqs.s3_Scenario_PresignedUrl.start-->
<!--custom.scenario_prereqs.s3_Scenario_PresignedUrl.end-->


<!--custom.scenarios.s3_Scenario_PresignedUrl.start-->
```
go run ./cmd -scenario presigning
```
<!--custom.scenarios.s3_Scenario_PresignedUrl.end-->

#### Lock Amazon S3 objects

This example shows you how to work with S3 object lock features.


<!--custom.scenario_prereqs.s3_Scenario_ObjectLock.start-->
<!--custom.scenario_prereqs.s3_Scenario_ObjectLock.end-->


<!--custom.scenarios.s3_Scenario_ObjectLock.start-->
<!--custom.scenarios.s3_Scenario_ObjectLock.end-->

#### Upload or download large files

This example shows you how to upload or download large files to and from Amazon S3.


<!--custom.scenario_prereqs.s3_Scenario_UsingLargeFiles.start-->
<!--custom.scenario_prereqs.s3_Scenario_UsingLargeFiles.end-->


<!--custom.scenarios.s3_Scenario_UsingLargeFiles.start-->
Large files are included as part of the `getstarted` scenario.

```
go run ./cmd -scenario getstarted
```
<!--custom.scenarios.s3_Scenario_UsingLargeFiles.end-->

### Tests

⚠ Running tests might result in charges to your AWS account.


To find instructions for running these tests, see the [README](../README.md#Tests)
in the `gov2` folder.



<!--custom.tests.start-->
<!--custom.tests.end-->

## Additional resources

- [Amazon S3 User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [Amazon S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
- [SDK for Go V2 Amazon S3 reference](https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/service/s3)

<!--custom.resources.start-->
<!--custom.resources.end-->

---

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0