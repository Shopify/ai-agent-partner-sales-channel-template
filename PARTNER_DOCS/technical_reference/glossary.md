# Glossary

**Vibe Partner** - An AI-powered development platform that has registered for the Shopify Vibe Partner Program. As a Vibe Partner, you integrate Shopify's commerce capabilities into your platform, enabling your users to create and manage Shopify stores through AI-assisted development workflows.

**Vibe Store APIs** - The set of REST APIs that allow you to programmatically create dev stores, transfer store ownership, and check transfer eligibility. These APIs are accessed using the Global Access Token generated from your Partner App.

**Partner App** - The app you create in your Shopify Partner Dashboard. It authenticates with the Partners API using a Client ID and Client Secret to generate a Global Access Token. Use it to create dev stores, generate claim URLs for store transfers, and manage the lifecycle of stores you create for your users.

**Your Sales Channel App** - The app that gets installed into each dev store you create. It provides API access to interact with individual stores, including generating Admin API access tokens (for backend operations) and Storefront API access tokens. Shopify provides a template to help you build this app. You build and host this app. Shopify provides a template with all the functionality you'll need out of the box.

**Dev Store** - A Shopify development store created programmatically through the Vibe Store APIs. Dev stores are fully functional stores with products, storefronts, and checkout capabilities. They are initially owned by the partner's account and can later be transferred to end users via a Claim Store URL.

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
