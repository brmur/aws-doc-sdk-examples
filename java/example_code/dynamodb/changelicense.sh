#!/bin/bash
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

find src -name "*.java" -print0 | xargs -0 \
sed -i -e '/Copyright/,/Licensed under the Apache License, Version 2.0/c\
/*\
 * Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.\
 *\
 * Licensed under the Apache License, Version 2.0 (the "License").\
 * You may not use this file except in compliance with the License.\
 * A copy of the License is located at\
 *\
 *  http://aws.amazon.com/apache2.0\
 *\
 * or in the "license" file accompanying this file. This file is distributed\
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\
 * express or implied. See the License for the specific language governing\
 * permissions and limitations under the License.\
 */\
'
find src | grep "java\-e" | xargs rm
