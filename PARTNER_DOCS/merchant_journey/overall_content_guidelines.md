# Overall content guidelines

Use these conventions to name each moment and write its copy. The conventions make Shopify integrations consistent across AI builders.

Shopify is the commerce engine behind your users' stores. It powers their products, checkout, and payments. Your platform builds the store's look and feel, and Shopify makes it sales-ready.

## Principles

Four rules apply to each merchant-facing message:

### Explain before the click

Say what Shopify is, why it is valuable, and what the merchant agrees to before they commit.

### Don't assume, orient

Always make sure the merchant knows where they are in the process and what to do next. For example, tell merchants they can build their Shopify store for free on your platform. Tell them they need a Shopify subscription when they are ready to sell.

### No insider terms

Write for someone who has never used Shopify. Replace words that only make sense inside Shopify.

### One word per moment

Use the canonical verb for each step. The headline and the action button or call to action should match.

## Words to avoid

Replace insider vocabulary with plain language.

| Don't use | Use instead |
| --- | --- |
| e-commerce | commerce, online store, or store |
| backend | Say what it does: products, checkout, and payments. |
| admin, as a generic noun | "Your Shopify store." Only use "admin" for the literal `admin.shopify.com` URL. |
| storefront, headless | store, Shopify, or your Shopify store |
| preview store | store or your Shopify store |
| dev store, development store | your store |
| auth, OAuth, authenticate | log in or sign in. Do not expose the technical term. |

## Talking about Shopify - principles for your agent

The preceding guidance applies to deterministic surfaces, such as buttons, cards, and set strings. This section applies to what your agent says about Shopify in open conversation. Treat these principles as agent rules.

### Facts to state correctly

- **Shopify is the commerce engine.** It powers products, checkout, and payments. The storefront is built on the partner platform, and Shopify makes it sales-ready.
- **It's free to build.** A paid plan is only needed when the merchant is ready to sell. Plans start at $1 per month.
- **Creating a store does not charge the merchant** or commit them to selling.

Do not improvise these facts. If you are unsure of a number or term, follow the guidance in [Defer when unsure](#defer-when-unsure).

### Surface at the right moment

- **Before the merchant agrees:** Say what Shopify is and what they agree to.
- **When the store is built:** The store is ready to preview and claim. It is not yet ready to sell.
- **Before they expect to be live:** Building a store does not open it for business. The merchant needs an active plan, a payment method, and store settings such as shipping and taxes. Set this expectation early.
- **At claim:** Explain that claiming makes the store theirs and creates their Shopify login.

### Framing and voice

- Talk about Shopify as a capability inside the partner platform, not a separate setup tool.
- Use the canonical verbs: create a store, connect an existing store, claim, and subscribe. Use "connect" only for an existing store.
- Write for someone who has never used Shopify. Avoid insider terms such as admin, backend, dev store, and OAuth.
- Use a straightforward and friendly voice. Do not oversell.

### Never say

| Never say | Why |
| --- | --- |
| A free trial or $1 plan to a merchant connecting an existing store | They may already use a paid plan. |
| That a merchant is "live" or "ready to sell" before they configure a plan and payments | The statement is not true until billing and payments are configured. |
| Specific refund, tax, or policy details that you cannot confirm | An incorrect Shopify fact reflects on both platforms. |
| Guaranteed region-specific details, such as payment availability or fees | These details vary by market. |

### Defer when unsure

If the merchant asks about pricing, billing, policies, or other facts you cannot confirm, state what you know. Direct the merchant to their Shopify store or the Shopify Help Center. Do not guess.

Keep changing facts current. Do not hardcode pricing, trial terms, or store status. When possible, get this information from Shopify at runtime.

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
