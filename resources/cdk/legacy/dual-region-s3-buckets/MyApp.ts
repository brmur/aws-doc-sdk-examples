// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

//
// This file is licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License. A copy of the
// License is located at
//
// http://aws.amazon.com/apache2.0/
//
// This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
// OF ANY KIND, either express or implied. See the License for the specific
// language governing permissions and limitations under the License.
// snippet-start:[cdk.typescript.MyApp]
import * as core from "@aws-cdk/core";
import { MyStack } from "../lib/MyApp-stack";

const app = new core.App();

new MyStack(app, "MyWestCdkStack", {
  env: {
    region: "us-west-2",
  },
  enc: false,
});

new MyStack(app, "MyEastCdkStack", {
  env: {
    region: "us-east-1",
  },
  enc: true,
});
// snippet-end:[cdk.typescript.MyApp]
