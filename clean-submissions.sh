#!/bin/bash

# clean-submissions.sh
# Script to delete all submissions from a wallet address

# Default wallet address from command line args
WALLET_ADDRESS=$1

if [ -z "$WALLET_ADDRESS" ]; then
  echo "Error: Please provide a wallet address."
  echo "Usage: ./clean-submissions.sh <wallet-address>"
  exit 1
fi

echo "Deleting submissions for wallet: $WALLET_ADDRESS"
echo "This will delete ALL submissions associated with this wallet address."
echo "Are you sure you want to continue? (y/n)"
read CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Operation cancelled."
  exit 0
fi

# Run the deletion script
echo "Running deletion script..."
node scripts/delete-submissions.js $WALLET_ADDRESS

# If the script ran successfully
if [ $? -eq 0 ]; then
  echo "✅ Submissions deleted successfully!"
else
  echo "❌ Error: Failed to delete submissions."
  exit 1
fi

echo "Done." 