# Getting Started

Before you can begin the technical integration, you must complete the following steps:

## 1. Create a Shopify Partner Account

If your organization does not already have a Shopify Partner account, create one at [https://www.shopify.com/partners](https://www.shopify.com/partners).

## 2. Contact Shopify to Register for Vibe Store API Access

Once your Partner account is created, contact Shopify with the following information:

- The email address associated with your Partner account
- Your organization name
- Your platform name

Shopify will then review your application and grant your account access to the Vibe Store APIs.

## 3. Create Your Partner App

After Shopify has enabled API access for your account, create an app in your Partner Dashboard:

- Navigate to App Distribution in the left menu and click Visit Dev Dashboard
- Select Start from Dev Dashboard to create a new app
- Record your app's Client ID and Client Secret (found in Dev Dashboard > Your App > Settings)

## 4. Share Your Client ID with Shopify

Provide your app's Client ID to your Shopify representative. This allows Shopify to grant your app permission to call the Vibe Store APIs programmatically.

> **Important:** Your Sales Channel App will only be auto-installed on new dev stores after it has passed Shopify's app review. During development, these are two parallel workstreams: you can begin integrating with the Vibe Store API while building your Sales Channel App separately using the Shopify CLI. To test end-to-end, use the Shopify CLI to manually install your Sales Channel App on any dev stores you create.

---

## In this guide

- [Introduction](../introduction.md)
- [Merchant Journey](../merchant_journey/overall_merchant_flow.md)
  - [Overall merchant flow](../merchant_journey/overall_merchant_flow.md)
  - [Overall content guidelines](../merchant_journey/overall_content_guidelines.md)
  - [Integrate with Shopify](../merchant_journey/integrate_with_shopify.md)
  - [Create a new store and claim](../merchant_journey/create_and_claim_store.md)
  - [Connect to an existing store](../merchant_journey/connect_existing_store.md)
  - [Partner sales channel](../merchant_journey/partner_sales_channel.md)
  - [Shopify onboarding steps](../merchant_journey/shopify_onboarding.md)
- [Technical Reference](../technical_reference/glossary.md)
  - [Glossary](../technical_reference/glossary.md)
  - [Understanding the Two-App Architecture](../technical_reference/two_app_architecture.md)
  - [Security Criteria](../technical_reference/security_criteria.md)
  - [Getting Started](../technical_reference/getting_started.md)
  - [Partner App: Managing Dev Stores](../technical_reference/partner_app.md)
  - [Your Sales Channel App: Accessing Store APIs](../technical_reference/sales_channel_app.md)
  - [Connect Existing Merchants](../technical_reference/connect_existing_merchants.md)
  - [Changelog](../technical_reference/changelog.md)
