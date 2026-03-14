#!/bin/bash
set -euo pipefail
PROJECT_ID="argon-depth-446413-t0"
SERVICE_NAME="frontend"
REGION="asia-northeast1"
echo "=== JLPT Frontend Deploy ==="
gcloud run deploy ${SERVICE_NAME} --source . --region=${REGION} --allow-unauthenticated --project=${PROJECT_ID}
echo "=== Deploy Complete ==="
gcloud run services describe ${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID} --format="value(status.url)"
