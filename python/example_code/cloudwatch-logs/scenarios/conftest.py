# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Contains common test fixtures used to run CloudWatch Logs scenario tests.
"""

import logging

import pytest

logger = logging.getLogger(__name__)


class InputMocker:
    """Mocks builtins.input for automated testing of interactive scenarios."""

    def __init__(self, monkeypatch):
        self.answers = None
        self.index = 0
        self.monkeypatch = monkeypatch

    def mock_answers(self, answers):
        self.answers = answers
        self.index = 0
        self.monkeypatch.setattr("builtins.input", self._handle_input)

    def _handle_input(self, question):
        if self.index >= len(self.answers):
            raise IndexError(f"Got question '{question}' but have no more answers.")
        val = self.answers[self.index]
        self.index += 1
        logger.info("Input Q: %s A: %s", question, val)
        return val


@pytest.fixture
def input_mocker(monkeypatch):
    """Provides an InputMocker instance for mocking user input in tests."""
    return InputMocker(monkeypatch)
