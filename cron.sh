#!/bin/bash

# Check if the current date's month and day match August 18th (08-18)
if [[ "$(date '+%m-%d')" == "08-18" ]]; then
    echo "Triggering the Scheduled Pipeline"
else
    echo "Skipping the Pipeline as it is not scheduled to run on this specified date"
    exit 1  # Exit with an error status code
fi
