# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Purpose: Demonstrates how to use Amazon CloudWatch Logs to create and manage
log groups, streams, events, and queries.

This scenario walks through:
1. Creating a log group
2. Creating a log stream
3. Setting a retention policy
4. Putting log events
5. Describing log groups
6. Filtering log events
7. Running a CloudWatch Logs Insights query
8. Starting a Live Tail session
9. Cleaning up resources
"""

import logging
import time
import uuid

import boto3

from cloudwatch_logs_wrapper import CloudWatchLogsWrapper

logger = logging.getLogger(__name__)


# snippet-start:[python.example_code.cloudwatch-logs.CloudWatchLogsScenario]
class CloudWatchLogsScenario:
    """Runs an interactive scenario demonstrating CloudWatch Logs basics."""

    def __init__(self, wrapper: CloudWatchLogsWrapper) -> None:
        """
        :param wrapper: An instance of CloudWatchLogsWrapper.
        """
        self.wrapper = wrapper
        self.log_group_name = None
        self.log_stream_name = None

    def run_scenario(self) -> None:
        """Runs the CloudWatch Logs basics scenario."""
        print("=" * 70)
        print("Welcome to the Amazon CloudWatch Logs Basics Scenario!")
        print("=" * 70)
        print(
            "\nThis scenario demonstrates how to create and manage log groups,\n"
            "streams, events, and queries using CloudWatch Logs.\n"
        )
        input("Press Enter to begin...")

        # Step 1: Create a log group
        self.log_group_name = f"/examples/cloudwatch-logs-basics-{uuid.uuid4().hex[:8]}"
        print(f"\n1. Creating log group: {self.log_group_name}")
        self.wrapper.create_log_group(self.log_group_name)
        print("   Log group created successfully.")
        input("Press Enter to continue...")

        # Step 2: Create a log stream
        self.log_stream_name = f"example-stream-{uuid.uuid4().hex[:8]}"
        print(f"\n2. Creating log stream: {self.log_stream_name}")
        self.wrapper.create_log_stream(self.log_group_name, self.log_stream_name)
        print("   Log stream created successfully.")
        input("Press Enter to continue...")

        # Step 3: Set retention policy
        retention_days = 7
        print(f"\n3. Setting retention policy to {retention_days} days")
        self.wrapper.put_retention_policy(self.log_group_name, retention_days)
        print(f"   Retention policy set to {retention_days} days.")
        input("Press Enter to continue...")

        # Step 4: Put log events
        print("\n4. Putting sample log events")
        base_time = int(time.time() * 1000)
        log_events = [
            {"timestamp": base_time, "message": "[INFO] Application started"},
            {
                "timestamp": base_time + 1000,
                "message": "[INFO] Processing request id=12345",
            },
            {
                "timestamp": base_time + 2000,
                "message": "[WARN] Slow response detected: 2500ms",
            },
            {
                "timestamp": base_time + 3000,
                "message": "[ERROR] Connection timeout to downstream service",
            },
            {
                "timestamp": base_time + 4000,
                "message": "[INFO] Request completed successfully",
            },
        ]
        self.wrapper.put_log_events(
            self.log_group_name, self.log_stream_name, log_events
        )
        print(f"   Put {len(log_events)} log events.")
        input("Press Enter to continue...")

        # Step 5: Describe log groups
        print(f"\n5. Describing log groups with prefix: {self.log_group_name}")
        log_groups = self.wrapper.describe_log_groups(self.log_group_name)
        for lg in log_groups:
            print(f"   - {lg.get('logGroupName', 'N/A')}")
            print(f"     Retention: {lg.get('retentionInDays', 'Never expire')} days")
            print(f"     Stored bytes: {lg.get('storedBytes', 0)}")
        input("Press Enter to continue...")

        # Step 6: Filter log events
        print("\n6. Filtering log events for 'ERROR' pattern")
        # Allow time for log events to be indexed
        time.sleep(2)
        events = self.wrapper.filter_log_events(
            self.log_group_name,
            filter_pattern="ERROR",
            log_stream_names=[self.log_stream_name],
        )
        if events:
            for event in events:
                print(f"   - {event.get('message', '')}")
        else:
            print("   No matching events found (may need more indexing time).")
        input("Press Enter to continue...")

        # Step 7: Run Insights query
        print("\n7. Running CloudWatch Logs Insights query")
        end_time = int(time.time())
        start_time = end_time - 300  # Last 5 minutes
        query_string = (
            "fields @timestamp, @message "
            "| filter @message like /ERROR/ "
            "| sort @timestamp desc "
            "| limit 10"
        )
        query_id = self.wrapper.start_query(
            self.log_group_name, query_string, start_time, end_time
        )
        print(f"   Query started (ID: {query_id}). Waiting for results...")
        results = self.wrapper.get_query_results(query_id)
        print(f"   Query status: {results['status']}")
        print(f"   Results found: {len(results['results'])}")
        for result in results["results"]:
            fields = {item["field"]: item["value"] for item in result}
            print(f"   - {fields.get('@message', 'N/A')}")
        input("Press Enter to continue...")

        # Step 8: Live Tail (brief demo)
        print("\n8. Starting a Live Tail session (5 seconds)")
        print("   (Events streamed during the session will appear below)")
        # Get the log group ARN for Live Tail
        log_group_arn = None
        for lg in log_groups:
            if lg.get("logGroupName") == self.log_group_name:
                log_group_arn = lg.get("arn", "").rstrip("*")
                break
        if log_group_arn:
            try:
                tail_events = self.wrapper.start_live_tail(
                    log_group_identifiers=[log_group_arn],
                    log_stream_names=[self.log_stream_name],
                    duration_seconds=5,
                )
                print(f"   Received {len(tail_events)} event(s) during Live Tail.")
            except Exception as e:
                print(f"   Live Tail not available: {e}")
        else:
            print("   Could not determine log group ARN for Live Tail.")
        input("Press Enter to continue...")

        # Step 9: Cleanup
        print("\n9. Cleanup")
        answer = input("   Delete the log group and all its data? (y/n): ")
        if answer.lower() == "y":
            self.wrapper.delete_log_group(self.log_group_name)
            print(f"   Deleted log group: {self.log_group_name}")
            self.log_group_name = None
        else:
            print(f"   Log group '{self.log_group_name}' was NOT deleted.")

        print("\n" + "=" * 70)
        print("Thanks for watching!")
        print("=" * 70)


# snippet-end:[python.example_code.cloudwatch-logs.CloudWatchLogsScenario]


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    wrapper = CloudWatchLogsWrapper.from_client()
    scenario = CloudWatchLogsScenario(wrapper)
    scenario.run_scenario()
