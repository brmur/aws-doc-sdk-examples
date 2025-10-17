# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Purpose

Shows how to use the AWS SDK for Python (Boto3) with Amazon Inspector
to enable scanning, manage findings, and assess security coverage.
"""

import logging
import boto3
from botocore.exceptions import ClientError
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)


# snippet-start:[python.example_code.inspector.InspectorWrapper.class]
# snippet-start:[python.example_code.inspector.InspectorWrapper.decl]
class InspectorWrapper:
    """Encapsulates Amazon Inspector functionality."""

    def __init__(self, inspector_client: boto3.client):
        """
        :param inspector_client: A Boto3 Amazon Inspector client.
        """
        self.inspector_client = inspector_client

    @classmethod
    def from_client(cls):
        """
        Creates an InspectorWrapper instance with a default Inspector client.
        
        :return: An instance of InspectorWrapper.
        """
        inspector_client = boto3.client("inspector2")
        return cls(inspector_client)
# snippet-end:[python.example_code.inspector.InspectorWrapper.decl]

    # snippet-start:[python.example_code.inspector.Enable]
    def enable_inspector(self, resource_types: List[str], account_ids: List[str] = None) -> Dict[str, Any]:
        """
        Enables Amazon Inspector for the specified resource types.
        
        :param resource_types: List of resource types to enable scanning for (e.g., ['ECR', 'EC2']).
        :param account_ids: Optional list of account IDs to enable scanning for.
        :return: Response from the enable operation.
        """
        try:
            params = {"resourceTypes": resource_types}
            if account_ids:
                params["accountIds"] = account_ids
                
            response = self.inspector_client.enable(**params)
            logger.info(f"Successfully enabled Inspector for resource types: {resource_types}")
            return response
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "ValidationException":
                logger.error("Invalid resource types or account permissions")
            elif error_code == "AccessDeniedException":
                logger.error("Insufficient permissions to enable Inspector")
            else:
                logger.error(f"Error enabling Inspector: {e}")
            raise
    # snippet-end:[python.example_code.inspector.Enable]

    # snippet-start:[python.example_code.inspector.BatchGetAccountStatus]
    def get_account_status(self, account_ids: List[str] = None) -> Dict[str, Any]:
        """
        Retrieves the Amazon Inspector status for the specified accounts.
        
        :param account_ids: Optional list of account IDs to get status for.
        :return: Account status information.
        """
        try:
            params = {}
            if account_ids:
                params["accountIds"] = account_ids
                
            response = self.inspector_client.batch_get_account_status(**params)
            logger.info("Successfully retrieved account status")
            return response
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "ValidationException":
                logger.error("Invalid account IDs format")
            elif error_code == "AccessDeniedException":
                logger.error("Access denied for account status")
            else:
                logger.error(f"Error getting account status: {e}")
            raise
    # snippet-end:[python.example_code.inspector.BatchGetAccountStatus]

    # snippet-start:[python.example_code.inspector.ListFindings]
    def list_findings(self, filter_criteria: Dict[str, Any] = None, 
                     sort_criteria: Dict[str, Any] = None, max_results: int = None) -> Dict[str, Any]:
        """
        Lists security findings from Amazon Inspector.
        
        :param filter_criteria: Optional filter criteria to apply to findings.
        :param sort_criteria: Optional sort criteria for findings.
        :param max_results: Maximum number of findings to return.
        :return: List of findings.
        """
        try:
            params = {}
            if filter_criteria:
                params["filterCriteria"] = filter_criteria
            if sort_criteria:
                params["sortCriteria"] = sort_criteria
            if max_results:
                params["maxResults"] = max_results
                
            response = self.inspector_client.list_findings(**params)
            logger.info(f"Successfully retrieved {len(response.get('findings', []))} findings")
            return response
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "ValidationException":
                logger.error("Invalid filter criteria or pagination parameters")
            elif error_code == "InternalServerException":
                logger.error("Internal server error, retrying may help")
            else:
                logger.error(f"Error listing findings: {e}")
            raise
    # snippet-end:[python.example_code.inspector.ListFindings]

    # snippet-start:[python.example_code.inspector.BatchGetFindingDetails]
    def get_finding_details(self, finding_arns: List[str]) -> Dict[str, Any]:
        """
        Gets detailed information for specific findings.
        
        :param finding_arns: List of finding ARNs to get details for.
        :return: Detailed finding information.
        """
        try:
            response = self.inspector_client.batch_get_finding_details(findingArns=finding_arns)
            logger.info(f"Successfully retrieved details for {len(finding_arns)} findings")
            return response
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "ValidationException":
                logger.error("Invalid finding ARNs format")
            elif error_code == "AccessDeniedException":
                logger.error("Access denied for specific findings")
            else:
                logger.error(f"Error getting finding details: {e}")
            raise
    # snippet-end:[python.example_code.inspector.BatchGetFindingDetails]

    # snippet-start:[python.example_code.inspector.ListCoverage]
    def list_coverage(self, filter_criteria: Dict[str, Any] = None, 
                     max_results: int = None) -> Dict[str, Any]:
        """
        Lists coverage statistics for resources scanned by Amazon Inspector.
        
        :param filter_criteria: Optional filter criteria for coverage.
        :param max_results: Maximum number of coverage records to return.
        :return: Coverage information for resources.
        """
        try:
            params = {}
            if filter_criteria:
                params["filterCriteria"] = filter_criteria
            if max_results:
                params["maxResults"] = max_results
                
            response = self.inspector_client.list_coverage(**params)
            logger.info(f"Successfully retrieved coverage for {len(response.get('coveredResources', []))} resources")
            return response
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "ValidationException":
                logger.error("Invalid filter or pagination parameters")
            else:
                logger.error(f"Error listing coverage: {e}")
            raise
    # snippet-end:[python.example_code.inspector.ListCoverage]

    # snippet-start:[python.example_code.inspector.Disable]
    def disable_inspector(self, resource_types: List[str], account_ids: List[str] = None) -> Dict[str, Any]:
        """
        Disables Amazon Inspector for the specified resource types.
        
        :param resource_types: List of resource types to disable scanning for.
        :param account_ids: Optional list of account IDs to disable scanning for.
        :return: Response from the disable operation.
        """
        try:
            params = {"resourceTypes": resource_types}
            if account_ids:
                params["accountIds"] = account_ids
                
            response = self.inspector_client.disable(**params)
            logger.info(f"Successfully disabled Inspector for resource types: {resource_types}")
            return response
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "ValidationException":
                logger.error("Invalid resource types for disabling")
            elif error_code == "ConflictException":
                logger.error("Inspector cannot be disabled due to conflicts")
            else:
                logger.error(f"Error disabling Inspector: {e}")
            raise
    # snippet-end:[python.example_code.inspector.Disable]

# snippet-end:[python.example_code.inspector.InspectorWrapper.class]


def usage_demo():
    """
    Shows how to use the InspectorWrapper class.
    """
    print("-" * 88)
    print("Welcome to the Amazon Inspector wrapper demo!")
    print("-" * 88)

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    wrapper = InspectorWrapper.from_client()
    
    try:
        # Get account status
        print("Getting account status...")
        status = wrapper.get_account_status()
        print(f"Account status: {status}")
        
        # List findings with severity filter
        print("\nListing critical findings...")
        filter_criteria = {
            "severity": [{"comparison": "EQUALS", "value": "CRITICAL"}]
        }
        findings = wrapper.list_findings(filter_criteria=filter_criteria, max_results=10)
        print(f"Found {len(findings.get('findings', []))} critical findings")
        
        # List coverage
        print("\nListing resource coverage...")
        coverage = wrapper.list_coverage(max_results=10)
        print(f"Coverage for {len(coverage.get('coveredResources', []))} resources")
        
    except ClientError as e:
        logger.error(f"Demo failed: {e}")


if __name__ == "__main__":
    usage_demo()