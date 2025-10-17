# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Purpose

Shows how to get started with Amazon Inspector by checking the current account status.
"""

import logging
import boto3
from botocore.exceptions import ClientError

from inspector_wrapper import InspectorWrapper

logger = logging.getLogger(__name__)


# snippet-start:[python.example_code.inspector.Hello]
def hello_inspector():
    """
    Use the AWS SDK for Python (Boto3) to create an Amazon Inspector client and check
    the current account status. This example uses the default settings specified in
    your shared credentials and config files.
    """
    print("Hello, Amazon Inspector! Let's check your account status.")
    
    try:
        # Create Inspector wrapper
        inspector_wrapper = InspectorWrapper.from_client()
        
        # Get account status
        response = inspector_wrapper.get_account_status()
        
        if "accounts" in response and response["accounts"]:
            account = response["accounts"][0]
            account_id = account.get("accountId", "Unknown")
            state = account.get("state", {})
            status = state.get("status", "Unknown")
            
            print(f"Account ID: {account_id}")
            print(f"Inspector Status: {status}")
            
            # Show resource-specific status
            resource_state = account.get("resourceState", {})
            if resource_state:
                print("\nResource Status:")
                for resource_type, resource_info in resource_state.items():
                    resource_status = resource_info.get("status", "Unknown")
                    print(f"  {resource_type.upper()}: {resource_status}")
            
            # Show available scan types and regions
            print(f"\nInspector is available in this region and can scan:")
            print("  - EC2 instances for software vulnerabilities")
            print("  - ECR container images for vulnerabilities")
            print("  - Lambda functions for code vulnerabilities")
            
        else:
            print("No account information available.")
            
    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        if error_code == "AccessDeniedException":
            print("Access denied. Please ensure you have the necessary permissions for Amazon Inspector.")
        else:
            print(f"Error checking Inspector status: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")


if __name__ == "__main__":
    hello_inspector()
# snippet-end:[python.example_code.inspector.Hello]