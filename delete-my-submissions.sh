#!/bin/bash

# Script to delete all submissions from the currently connected wallet
# This is a simplified version to help users clean up their submissions

# Enable debug mode if needed
if [ "$DEBUG" = "1" ]; then
  set -x
fi

# Check if jq is installed (needed for JSON processing)
if ! command -v jq &> /dev/null; then
  echo "This script requires jq for JSON processing. Please install it first."
  echo "On macOS: brew install jq"
  echo "On Ubuntu/Debian: sudo apt-get install jq"
  exit 1
fi

# Load environment variables if .env.local exists
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

# Check for Supabase credentials
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "Error: Missing Supabase credentials"
  echo "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local"
  exit 1
fi

# Determine which key to use - prefer service role key if available
API_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
if [ ! -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Using service role key for enhanced permissions"
  API_KEY=$SUPABASE_SERVICE_ROLE_KEY
fi

# Parse command-line arguments
FORCE_MODE=0
WALLET_ADDRESS=""

for arg in "$@"; do
  if [ "$arg" = "--force" ]; then
    FORCE_MODE=1
    echo "Force mode enabled - will attempt to bypass RLS policies"
  else
    WALLET_ADDRESS=$arg
  fi
done

if [ -z "$WALLET_ADDRESS" ]; then
  echo "No wallet address provided."
  echo "The script will attempt to delete all submissions for the wallet address stored in your local browser."
  echo "If you want to specify a wallet address, run: ./delete-my-submissions.sh <wallet-address>"
  echo "Continuing in 5 seconds..."
  sleep 5
  
  # Try to get wallet address from localStorage using browser
  if command -v osascript &> /dev/null; then
    echo "Attempting to retrieve wallet address from browser (macOS only)..."
    WALLET_SCRIPT='tell application "Safari" to do JavaScript "localStorage.getItem(\"suiAddress\")" in document 1'
    WALLET_ADDRESS=$(osascript -e "$WALLET_SCRIPT" 2>/dev/null)
    
    if [ -z "$WALLET_ADDRESS" ] || [ "$WALLET_ADDRESS" = "null" ]; then
      echo "Could not retrieve wallet address automatically."
      echo "Please provide your wallet address as an argument: ./delete-my-submissions.sh <wallet-address>"
      exit 1
    fi
    
    echo "Found wallet address: $WALLET_ADDRESS"
  else
    echo "Cannot automatically retrieve wallet address."
    echo "Please provide your wallet address as an argument: ./delete-my-submissions.sh <wallet-address>"
    exit 1
  fi
fi

echo "Deleting submissions for wallet: $WALLET_ADDRESS"
echo "This will delete ALL submissions associated with this wallet address."
echo "Are you sure you want to continue? (y/n)"
read CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Operation cancelled."
  exit 0
fi

# List all projects first to find IDs
echo "Finding projects for this wallet address..."
PROJECTS_RESPONSE=$(curl -s -X GET "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/projects?select=id,project_title,wallet_address" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $API_KEY")

if [[ -z "$PROJECTS_RESPONSE" || "$PROJECTS_RESPONSE" == "[]" ]]; then
  echo "No projects found for this wallet address."
  exit 0
fi

echo "Found projects, preparing to delete..."
echo "$PROJECTS_RESPONSE" | jq -r '.[] | "ID: \(.id) | Title: \(.project_title) | Wallet: \(.wallet_address)"'

# Extract project IDs where wallet matches
PROJECT_IDS=()
while read -r id; do
  if [[ ! -z "$id" ]]; then
    PROJECT_IDS+=("$id")
  fi
done < <(echo "$PROJECTS_RESPONSE" | jq -r '.[] | select((.wallet_address | tostring | contains("'"$WALLET_ADDRESS"'")) or .wallet_address == "'"$WALLET_ADDRESS"'") | .id')

if [[ ${#PROJECT_IDS[@]} -eq 0 ]]; then
  echo "No matching projects found after filtering by wallet address."
  exit 0
fi

echo "Found ${#PROJECT_IDS[@]} projects to delete."

# Set up additional headers for force mode
ADDITIONAL_HEADERS=""
if [ "$FORCE_MODE" -eq 1 ]; then
  ADDITIONAL_HEADERS="-H \"Prefer: resolution=merge-duplicates\""
fi

# Delete each project individually
for id in "${PROJECT_IDS[@]}"; do
  echo "Deleting project $id..."
  
  # Construct command with or without additional headers
  if [ "$FORCE_MODE" -eq 1 ]; then
    DELETE_RESPONSE=$(curl -s -X DELETE "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/projects?id=eq.$id" \
      -H "apikey: $API_KEY" \
      -H "Authorization: Bearer $API_KEY" \
      -H "Prefer: return=representation" \
      -H "Prefer: resolution=merge-duplicates")
  else
    DELETE_RESPONSE=$(curl -s -X DELETE "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/projects?id=eq.$id" \
      -H "apikey: $API_KEY" \
      -H "Authorization: Bearer $API_KEY" \
      -H "Prefer: return=representation")
  fi
  
  if [[ -z "$DELETE_RESPONSE" ]]; then
    echo "Project $id may have been deleted (no error response)."
  else
    echo "Response for project $id: $DELETE_RESPONSE"
  fi
  
  # Verify deletion
  CHECK_RESPONSE=$(curl -s -X GET "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/projects?id=eq.$id&select=id" \
    -H "apikey: $API_KEY" \
    -H "Authorization: Bearer $API_KEY")
    
  if [[ "$CHECK_RESPONSE" == "[]" ]]; then
    echo "✅ Verified: Project $id has been deleted."
  else
    echo "❌ Warning: Project $id still exists after deletion attempt."
  fi
done

echo "Operation completed." 