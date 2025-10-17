# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Stub functions that are used by the Amazon Inspector unit tests.
"""

from test_tools.example_stubber import ExampleStubber


class InspectorStubber(ExampleStubber):
    """
    A class that implements stub functions used by Amazon Inspector unit tests.
    """

    def __init__(self, client, use_stubs=True):
        """
        Initializes the object with a specific client and configures it for stubbing or AWS passthrough.
        """
        super().__init__(client, use_stubs)

    def stub_enable(self, resource_types: list = None, account_ids: list = None, error_code: str = None) -> None:
        """
        Stub the enable function.

        :param resource_types: List of resource types to enable.
        :param account_ids: List of account IDs.
        :param error_code: Simulated error code to raise.
        """
        expected_params = {}
        if resource_types:
            expected_params["resourceTypes"] = resource_types
        if account_ids:
            expected_params["accountIds"] = account_ids

        response = {
            "accounts": [
                {
                    "accountId": "123456789012",
                    "status": "ENABLING",
                    "resourceStatus": {
                        "ec2": "ENABLING"
                    }
                }
            ]
        }
        self._stub_bifurcator(
            "enable", expected_params, response, error_code=error_code
        )

    def stub_batch_get_account_status(self, account_ids: list = None, error_code: str = None) -> None:
        """
        Stub the batch_get_account_status function.

        :param account_ids: List of account IDs to get status for.
        :param error_code: Simulated error code to raise.
        """
        expected_params = {}
        if account_ids:
            expected_params["accountIds"] = account_ids

        response = {
            "accounts": [
                {
                    "accountId": "123456789012",
                    "state": {
                        "status": "ENABLED"
                    },
                    "resourceState": {
                        "ec2": {
                            "status": "ENABLED"
                        },
                        "ecr": {
                            "status": "ENABLED"
                        }
                    }
                }
            ]
        }
        self._stub_bifurcator(
            "batch_get_account_status", expected_params, response, error_code=error_code
        )

    def stub_list_findings(self, filter_criteria: dict = None, sort_criteria: dict = None, 
                          max_results: int = None, next_token: str = None, error_code: str = None) -> None:
        """
        Stub the list_findings function.

        :param filter_criteria: Filter criteria for findings.
        :param sort_criteria: Sort criteria for findings.
        :param max_results: Maximum number of results to return.
        :param next_token: Token for pagination.
        :param error_code: Simulated error code to raise.
        """
        expected_params = {}
        if filter_criteria:
            expected_params["filterCriteria"] = filter_criteria
        if sort_criteria:
            expected_params["sortCriteria"] = sort_criteria
        if max_results:
            expected_params["maxResults"] = max_results
        if next_token:
            expected_params["nextToken"] = next_token

        response = {
            "findings": [
                {
                    "findingArn": "arn:aws:inspector2:us-east-1:123456789012:finding/0123456789abcdef0123456789abcdef",
                    "awsAccountId": "123456789012",
                    "type": "PACKAGE_VULNERABILITY",
                    "description": "CVE-2023-1234 - Critical vulnerability in package",
                    "severity": "CRITICAL",
                    "firstObservedAt": "2023-01-01T00:00:00.000Z",
                    "lastObservedAt": "2023-01-01T00:00:00.000Z",
                    "updatedAt": "2023-01-01T00:00:00.000Z",
                    "status": "ACTIVE",
                    "remediation": {
                        "recommendation": {
                            "text": "Update the package to the latest version"
                        }
                    },
                    "resources": [
                        {
                            "id": "i-1234567890abcdef0",
                            "type": "AWS_EC2_INSTANCE"
                        }
                    ],
                    "packageVulnerabilityDetails": {
                        "source": "NVD",
                        "vulnerabilityId": "CVE-2023-1234",
                        "vulnerablePackages": [
                            {
                                "name": "example-package",
                                "version": "1.0.0",
                                "sourceLayerHash": "sha256:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12"
                            }
                        ],
                        "cvss": [
                            {
                                "version": "3.1",
                                "baseScore": 9.8,
                                "scoringVector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
                                "source": "NVD"
                            }
                        ]
                    }
                }
            ]
        }
        self._stub_bifurcator(
            "list_findings", expected_params, response, error_code=error_code
        )

    def stub_batch_get_finding_details(self, finding_arns: list, error_code: str = None) -> None:
        """
        Stub the batch_get_finding_details function.

        :param finding_arns: List of finding ARNs to get details for.
        :param error_code: Simulated error code to raise.
        """
        expected_params = {"findingArns": finding_arns}

        response = {
            "findingDetails": [
                {
                    "findingArn": finding_arns[0] if finding_arns else "arn:aws:inspector2:us-east-1:123456789012:finding/0123456789abcdef0123456789abcdef",
                    "cisaData": {
                        "action": "Apply updates per vendor instructions",
                        "dateAdded": "2023-01-01T00:00:00.000Z"
                    },
                    "riskScore": 85,
                    "tools": ["INSPECTOR"],
                    "ttps": ["T1190"]
                }
            ]
        }
        self._stub_bifurcator(
            "batch_get_finding_details", expected_params, response, error_code=error_code
        )

    def stub_list_coverage(self, filter_criteria: dict = None, max_results: int = None, 
                          next_token: str = None, error_code: str = None) -> None:
        """
        Stub the list_coverage function.

        :param filter_criteria: Filter criteria for coverage.
        :param max_results: Maximum number of results to return.
        :param next_token: Token for pagination.
        :param error_code: Simulated error code to raise.
        """
        expected_params = {}
        if filter_criteria:
            expected_params["filterCriteria"] = filter_criteria
        if max_results:
            expected_params["maxResults"] = max_results
        if next_token:
            expected_params["nextToken"] = next_token

        response = {
            "coveredResources": [
                {
                    "resourceId": "i-1234567890abcdef0",
                    "resourceType": "AWS_EC2_INSTANCE",
                    "accountId": "123456789012",
                    "scanType": "PACKAGE",
                    "scanStatus": {
                        "statusCode": "ACTIVE",
                        "reason": "SUCCESSFUL"
                    }
                }
            ]
        }
        self._stub_bifurcator(
            "list_coverage", expected_params, response, error_code=error_code
        )

    def stub_disable(self, resource_types: list = None, account_ids: list = None, error_code: str = None) -> None:
        """
        Stub the disable function.

        :param resource_types: List of resource types to disable.
        :param account_ids: List of account IDs.
        :param error_code: Simulated error code to raise.
        """
        expected_params = {}
        if resource_types:
            expected_params["resourceTypes"] = resource_types
        if account_ids:
            expected_params["accountIds"] = account_ids

        response = {
            "accounts": [
                {
                    "accountId": "123456789012",
                    "status": "DISABLING",
                    "resourceStatus": {
                        "ec2": "DISABLING"
                    }
                }
            ]
        }
        self._stub_bifurcator(
            "disable", expected_params, response, error_code=error_code
        )