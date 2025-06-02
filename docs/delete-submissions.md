# How to Delete Project Submissions in QuadFund

This guide explains the different ways to delete project submissions that you've made in QuadFund.

## Option 1: Using the Web Interface

1. Connect your wallet to QuadFund
2. Navigate to the "Submissions" page
3. Click on the "My Submissions" tab
4. Find the project you want to delete
5. Click the "Delete" button next to the project
6. Confirm the deletion in the popup dialog

This is the easiest method for most users.

## Option 2: Using the Command-Line Script

For developers or advanced users, you can use the command-line script to delete submissions:

1. Make sure you have access to the server environment
2. Run the script with your wallet address:

```bash
# From the project root
node scripts/delete-submissions.js 0x97ddf0eaaf9c80d4b88450437b7be6a1ae39d207df496797194ce2d1bd4a85fe
```

Replace the wallet address with your own.

3. The script will list all projects associated with that wallet
4. It will then delete all of them after confirmation

## Option 3: Using the API Directly

You can also directly call the API endpoint:

```
DELETE /api/delete-project?projectId=YOUR_PROJECT_ID&walletAddress=YOUR_WALLET_ADDRESS
```

This requires:
- Your project ID
- Your wallet address

The endpoint will verify that you own the project before deleting it.

## Note on Default Projects

The default projects (SuiLens, PixelMint, QuestLoop) are protected and cannot be deleted. These are built into the system for demonstration purposes.

## Questions or Issues?

If you encounter any problems with deleting your submissions, please contact the QuadFund team for assistance. 