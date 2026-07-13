# Amazon CloudWatch Logs code examples for the SDK for Python (Boto3)

## Overview

Shows how to use the AWS SDK for Python (Boto3) to work with Amazon CloudWatch Logs.

_Amazon CloudWatch Logs enables you to centralize the logs from all of your systems, applications, and AWS services that you use, in a single, highly scalable service._

## ⚠ Important

* Running this code might result in charges to your AWS account. For more details, see [AWS Pricing](https://aws.amazon.com/pricing/) and [Free Tier](https://aws.amazon.com/free/).
* Running the tests might result in charges to your AWS account.
* We recommend that you grant your code least privilege. At most, grant only the minimum permissions required to perform the task. For more information, see [Grant least privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).
* This code is not tested in every AWS Region. For more information, see [AWS Regional Services](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services).

## Code examples

### Prerequisites

For prerequisites, see the [README](../../README.md#Prerequisites) in the `python` folder.

Install the packages required by these examples by running the following in a virtual environment:

```
python -m pip install -r requirements.txt
```

### IAM permissions

The following IAM permissions are required to run these examples:

- `logs:CreateLogGroup`
- `logs:CreateLogStream`
- `logs:DeleteLogGroup`
- `logs:DescribeLogGroups`
- `logs:FilterLogEvents`
- `logs:GetQueryResults`
- `logs:PutLogEvents`
- `logs:PutRetentionPolicy`
- `logs:StartLiveTail`
- `logs:StartQuery`

### Get started

- [Hello CloudWatch Logs](cloudwatch_logs_hello.py) (`DescribeLogGroups`)

### Basics

Code examples that show you how to perform the essential operations within a service.

- [Learn the basics](scenario_cloudwatch_logs_basics.py)

### Single actions

Code excerpts that show you how to call individual service functions.

- [CreateLogGroup](cloudwatch-logs_wrapper.py#L59)
- [CreateLogStream](cloudwatch-logs_wrapper.py#L85)
- [DeleteLogGroup](cloudwatch-logs_wrapper.py#L385)
- [DescribeLogGroups](cloudwatch-logs_wrapper.py#L174)
- [FilterLogEvents](cloudwatch-logs_wrapper.py#L208)
- [GetQueryResults](cloudwatch-logs_wrapper.py#L341)
- [PutLogEvents](cloudwatch-logs_wrapper.py#L112)
- [PutRetentionPolicy](cloudwatch-logs_wrapper.py#L147)
- [StartLiveTail](cloudwatch-logs_wrapper.py#L256)
- [StartQuery](cloudwatch-logs_wrapper.py#L310)

## Run the examples

### Run the scenario

```
python scenario_cloudwatch_logs_basics.py
```

### Run the Hello example

```
python cloudwatch_logs_hello.py
```

## Tests

Run integration tests:

```
python -m pytest scenarios/cloudwatch-logs_basics_scenario.py -v
```

## Additional resources

- [Amazon CloudWatch Logs User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)
- [Amazon CloudWatch Logs API Reference](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/Welcome.html)
- [AWS SDK for Python (Boto3) CloudWatch Logs reference](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/logs.html)

---
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
