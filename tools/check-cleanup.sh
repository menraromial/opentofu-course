#!/usr/bin/env bash
# List every AWS resource that still carries the tag course=opentofu.
# Run it after each `tofu destroy`: the lab is clean only if nothing is listed.
#
# Usage: tools/check-cleanup.sh [chapter]
#   chapter  optional two-digit number (09, 10...) to restrict to one lab
# Environment: AWS_PROFILE (default: cours). The course region (eu-north-1)
# and us-east-1 (CloudFront certificates, global services) are checked.
set -euo pipefail

profile="${AWS_PROFILE:-cours}"
regions=(eu-north-1 us-east-1)
filters=(Key=course,Values=opentofu)
if [[ $# -ge 1 ]]; then
  filters+=("Key=chapter,Values=$1")
fi

left=0
for region in "${regions[@]}"; do
  arns=$(aws resourcegroupstaggingapi get-resources \
    --profile "$profile" --region "$region" \
    --tag-filters "${filters[@]}" \
    --query 'ResourceTagMappingList[].ResourceARN' --output text)
  for arn in $arns; do
    echo "left in $region: $arn"
    left=$((left + 1))
  done
done

if [[ $left -eq 0 ]]; then
  echo "clean: no resource tagged course=opentofu${1:+ and chapter=$1}"
else
  echo "$left resource(s) still tagged; destroy them before leaving the lab" >&2
  exit 1
fi
