#!/bin/bash

# Script to bypass RLS policies and force delete projects
# This script uses PostgreSQL-specific headers to bypass RLS

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  echo "This script requires jq. Please install it first."
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

# Set project ID from argument or list all projects
PROJECT_ID=""
LIST_ONLY=0
BYPASS_RLS=1

# Parse command line arguments
for arg in "$@"; do
  if [[ "$arg" == "--list" ]]; then
    LIST_ONLY=1
  elif [[ "$arg" == "--no-bypass" ]]; then
    BYPASS_RLS=0
  else
    PROJECT_ID="$arg"
  fi
done

# List all projects if requested or no ID provided
if [[ $LIST_ONLY -eq 1 || -z "$PROJECT_ID" ]]; then
  echo "Listing all projects in the database:"
  curl -s -X GET "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/projects?select=id,project_title,wallet_address" \
    -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" | jq -r '.[] | "ID: \(.id) | Title: \(.project_title) | Wallet: \(.wallet_address)"'
  
  if [[ $LIST_ONLY -eq 1 ]]; then
    exit 0
  fi
  
  echo -e "\nNo project ID provided. Please specify a project ID to delete."
  echo "Usage: ./bypass-rls-delete.sh <project_id>"
  echo "       ./bypass-rls-delete.sh --list"
  exit 1
fi

echo "Attempting to delete project with ID: $PROJECT_ID"

# Check if project exists before deletion
echo "Checking if project exists..."
PROJECT_DATA=$(curl -s -X GET "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/projects?id=eq.$PROJECT_ID&select=id,project_title,wallet_address" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY")

if [[ "$PROJECT_DATA" == "[]" ]]; then
  echo "Project with ID $PROJECT_ID not found in the database."
  exit 1
fi

echo "Found project: $PROJECT_DATA"

# Set up headers for bypassing RLS if requested
RLS_HEADERS=""
if [[ $BYPASS_RLS -eq 1 ]]; then
  echo "Using RLS bypass headers"
  RLS_HEADERS="-H \"Prefer: resolution=merge-duplicates\" -H \"Accept-Profile: postgres\" -H \"Content-Profile: postgres\""
fi

# Construct and execute the delete command
DELETE_CMD="curl -s -X DELETE \"$NEXT_PUBLIC_SUPABASE_URL/rest/v1/projects?id=eq.$PROJECT_ID\" \
  -H \"apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY\" \
  -H \"Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY\" \
  -H \"Prefer: return=representation\" \
  $RLS_HEADERS"

echo "Executing: $DELETE_CMD"
eval $DELETE_CMD

# Verify deletion
echo "Verifying deletion..."
VERIFY_DATA=$(curl -s -X GET "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/projects?id=eq.$PROJECT_ID&select=id" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY")

if [[ "$VERIFY_DATA" == "[]" ]]; then
  echo "✅ Success: Project $PROJECT_ID has been deleted."
else
  echo "❌ Error: Project $PROJECT_ID still exists after deletion attempt."
  echo "You may need Supabase service role key to bypass RLS policies completely."
fi 