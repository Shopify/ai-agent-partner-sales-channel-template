# Connect to an existing store

> **Note:** The connect-to-existing-store flow is still under development. The following guidance describes the target experience.

When merchants already have a Shopify store, send them to Shopify's store picker. They do not need to enter a store name or URL.

## General guidelines

The AI Builder offers a **Connect existing store** action. Shopify handles sign-in if needed, store selection, and authorization. The merchant must use an account with app installation permission.

### Send merchants to Shopify's store picker

Tell merchants what happens next in plain language: "Choose your store on Shopify to continue." Send them directly to the [store-picker authorization link](../technical_reference.md#connect-an-existing-store). Do not add a store-name or URL field, or require a separate Shopify sign-in step before this action.

### Name the permission requirement upfront

Some merchants share Shopify accounts with collaborators who cannot install apps. State the requirement before an installation failure. For example: "Use an account with permission to install apps for the store."

### Skip the claim step

Existing-store merchants already own their store. After they select a store, continue directly to the partner sales channel installation and authorization.

### What to include and what to skip

**Include**

- **A direct action.** Let merchants select **Connect existing store** to open Shopify's store picker.
- **Plain-language instructions.** Explain that they will choose their store on Shopify and may need to sign in.
- **Permission information.** State that the account needs app installation permission.

**Skip**

- Requests for a store name, Shopify admin URL, `myshopify.com` domain, or other technical identifiers.
- A separate, partner-hosted store picker or sign-in prerequisite before opening Shopify's picker.
- Claim flows. Existing-store merchants already own their store.

---

## In this guide

- [Introduction](../introduction.md)
- [Merchant Journey](../merchant_journey/overall_merchant_flow.md)
  - [Merchant flow](../merchant_journey/overall_merchant_flow.md)
  - [Content guidelines](../merchant_journey/overall_content_guidelines.md)
  - [Integrate with Shopify](../merchant_journey/integrate_with_shopify.md)
  - [Create a new store and claim](../merchant_journey/create_and_claim_store.md)
  - [Connect to an existing store](../merchant_journey/connect_existing_store.md)
  - [Partner sales channel](../merchant_journey/partner_sales_channel.md)
  - [Shopify onboarding steps](../merchant_journey/shopify_onboarding.md)
- [Technical Reference](../technical_reference.md)
