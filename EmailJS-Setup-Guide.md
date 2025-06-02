# EmailJS Setup Guide for QuadFund Contact Form

Follow these steps to set up EmailJS for the contact form to send emails to quadfund0@gmail.com:

## 1. Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and sign up for a free account
2. Verify your email address

## 2. Create an Email Service

1. In the EmailJS dashboard, click on "Email Services" in the left sidebar
2. Click "Add New Service"
3. Select your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Name your service `service_quadfund` (or update this name in the code)

## 3. Create an Email Template

1. In the EmailJS dashboard, click on "Email Templates" in the left sidebar
2. Click "Create New Template"
3. Name your template `template_contact_form` (or update this name in the code)
4. Design your email template using the variables:
   - `{{from_email}}` - The sender's email
   - `{{message}}` - The message content
   - Set the "To Email" field to `quadfund0@gmail.com`
   - Set an appropriate subject line (e.g., "New Contact Form Submission from QuadFund")
5. Save your template

## 4. Get Your Public Key

1. In the EmailJS dashboard, click on "Account" in the left sidebar
2. Copy your "Public Key"

## 5. Update the Contact Form Code

1. Open `pages/contact.js`
2. Replace the placeholder values with your actual EmailJS credentials:
   ```javascript
   const serviceId = 'service_quadfund'; // Replace with your service ID if different
   const templateId = 'template_contact_form'; // Replace with your template ID if different
   const publicKey = 'your_public_key'; // Replace with your actual public key
   ```

## 6. Test the Form

1. Fill out the form on your website
2. Submit it to verify that emails are being sent correctly
3. Check for any errors in the browser console

## Note

The free tier of EmailJS allows 200 emails per month, which should be sufficient for testing and initial usage. For production use with higher volume, consider upgrading to a paid plan. 