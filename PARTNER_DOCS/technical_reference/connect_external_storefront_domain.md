# Connect an external storefront domain

## Context

Merchants who build a storefront with an AI builder platform end up with their store in two places. The storefront runs on an external platform hosted at a domain the partner connects, while checkout still runs on the Shopify service on a Shopify domain.

This guide shows how your platform can connect the two, creating a seamless experience between Shopify surfaces and the external storefront.

## Prerequisites

- A stable storefront hostname, such as `storefront.example.com` or a custom domain. Your platform handles the deployment, hostname attachment, traffic routing and HTTPS.
- Your Sales Channel App installed on the shop.
- Permission to manage DNS for the ownership record's full name. (optional, but without it you will have to guide the merchant to do it manually)

Examples are illustrative and have not been executed. Replace the example hostname and angle-bracket placeholders with your own inputs or actual response values.

## 1. Request the external-domain scope

In your app's `shopify.app.toml`, append `write_external_storefront_domains` to the existing comma-separated `scopes` string under `[access_scopes]`. Keep all existing entries.

This example preserves the [Sales Channel App template's scopes](https://github.com/Shopify/ai-agent-partner-sales-channel-template/blob/1e71c916e9c4abb019bb763bdb5af5a9c64a0c38/shopify.app.toml#L15-L18) and adds the new scope once. If your app's list differs, retain its own entries.

```toml
[access_scopes]
scopes = "read_products,write_products,read_discounts,write_discounts,read_inventory,write_inventory,read_price_rules,write_price_rules,read_themes,unauthenticated_read_product_listings,write_publications,write_external_storefront_domains"
```

Release the updated app configuration and request the added permission through your normal installation/authorization flow. See [app configuration: access scopes](https://shopify.dev/docs/apps/tools/cli/configuration#access_scopes).

## 2. Publish the hostname on Shopify

Use the shop's **unstable Admin GraphQL API** for both calls. Configure your client explicitly for `unstable` rather than relying on its default version. This is temporary until we add this API to a future stable release.

Authenticate with the installed Sales Channel App's **shop Admin token**, kept server-side. For an unclaimed Vibe store, follow the approved pre-claim server-to-server token policy; for a claimed or existing store, use an online user token that enforces the user's permissions. See the [Sales Channel App authentication policy](https://github.com/Shopify/ai-agent-partner-sales-channel-template/blob/1e71c916e9c4abb019bb763bdb5af5a9c64a0c38/PARTNER_DOCS/technical_reference/sales_channel_app.md). Provider, Partner App and Storefront API tokens do not apply here.

Keep the same shop and publishing app identity for both calls. Refreshing an authorized token for that identity is fine.

```http
POST https://<SHOP_SUBDOMAIN>.myshopify.com/admin/api/unstable/graphql.json
Content-Type: application/json
X-Shopify-Access-Token: <SHOP_ADMIN_ACCESS_TOKEN>
```

Send a JSON body with `query` containing this GraphQL document and `variables` containing the object below:

```graphql
mutation PublishExternalStorefrontDomain($host: String!) {
  externalPartnerStorefrontDomainPublish(host: $host) {
    domain {
      host
      verificationStatus
      verificationRecords {
        type
        name
        value
        status
      }
    }
    resourceCreated
    userErrors {
      code
      field
      message
    }
  }
}
```

Variables — pass a hostname without a scheme or path:

```json
{
  "host": "storefront.example.com"
}
```

Illustrative response:

```json
{
  "data": {
    "externalPartnerStorefrontDomainPublish": {
      "domain": {
        "host": "storefront.example.com",
        "verificationStatus": "ACTION_REQUIRED",
        "verificationRecords": [
          {
            "type": "TXT",
            "name": "<DNS_RECORD_NAME_FROM_PUBLISH>",
            "value": "<DNS_RECORD_VALUE_FROM_PUBLISH>",
            "status": "ADD"
          }
        ]
      },
      "resourceCreated": true,
      "userErrors": []
    }
  }
}
```

Check HTTP/transport failures, top-level GraphQL `errors` (including partial `data`), and every `userErrors { code field message }` entry before using the domain. Treat a null/missing payload or domain as failure. Both user-error `code` and `field` can be null. Apply these checks to **both mutations**; HTTP 200 or an empty user-error list is insufficient without inspecting the domain and record statuses.

Save `domain.host` and its shop/app context for verification; Shopify may normalize the input's case. Retain the returned records for the DNS step. `resourceCreated` is a nullable creation/reuse indicator, not a readiness result: a repeated publish can return an incomplete verification with `resourceCreated: false`.

Choose the next step:

- **`VERIFIED` and an empty `verificationRecords` list:** skip steps 3 and 4. There may be no TXT verification object to verify.
- **Otherwise:** handle the records in step 3, then call verify in step 4. A nonempty list requires verify even when `verificationStatus` is already `VERIFIED` and every record is `OK`.

## 3. Configure the ownership TXT records

Use each record's returned `type`, `name` and `value` at the authoritative DNS provider. The record type is `TXT`; its value is the **expected ownership proof**, not an observed conflicting value.

Act on each record's `status`:

- `ADD`: add the missing record.
- `FAILURE`: correct the conflicting verification value.
- `OK`: leave the record unchanged.

The returned `name` is relative to the storefront hostname's **apex domain**. The full TXT name is the returned `name` + `.` + apex. For `storefront.example.com`, the apex is `example.com`.

Configure the authoritative DNS zone for that **full verification name**, which may differ from a zone delegated for `storefront.example.com`. Follow the provider's relative-name or fully-qualified-name format without appending the apex twice. Use the actual returned name/value; do not generate replacements or copy the placeholders above. Preserve unrelated DNS records and TXT values.

The TXT record proves ownership; it does not route storefront traffic. A provider accepting the write does not mean Shopify has observed it. Allow for propagation before verification, without assuming a fixed delay.

## 4. Verify ownership

Call [`externalPartnerStorefrontDomainVerifyTxt`](https://shopify.dev/docs/api/admin-graphql/unstable/mutations/externalPartnerStorefrontDomainVerifyTxt) with the saved `domain.host` from publish. Use the same shop endpoint and publishing app. This is a mutation that checks ownership and can start asynchronous connection work.

```graphql
mutation VerifyExternalStorefrontDomainTxt($host: String!) {
  externalPartnerStorefrontDomainVerifyTxt(host: $host) {
    domain {
      host
      verificationStatus
      verificationRecords {
        type
        name
        value
        status
      }
    }
    userErrors {
      code
      field
      message
    }
  }
}
```

Variables — use the actual returned hostname:

```json
{
  "host": "storefront.example.com"
}
```

Illustrative response:

```json
{
  "data": {
    "externalPartnerStorefrontDomainVerifyTxt": {
      "domain": {
        "host": "storefront.example.com",
        "verificationStatus": "VERIFIED",
        "verificationRecords": [
          {
            "type": "TXT",
            "name": "<DNS_RECORD_NAME_FROM_PUBLISH>",
            "value": "<DNS_RECORD_VALUE_FROM_PUBLISH>",
            "status": "OK"
          }
        ]
      },
      "userErrors": []
    }
  }
}
```

After the response checks in step 2, inspect `domain.verificationStatus`:

- `ACTION_REQUIRED`: missing DNS still needs attention. Check the returned records and the authoritative zone for their full names.
- `FAILED`: conflicting DNS or terminal/expired verification. Correcting DNS or repeating verify may not resolve an expired or terminal failure.
- `VERIFIED`: Shopify has observed the required ownership proof.

## Activation and storefront URLs

Ownership verification does not confirm asynchronous connection or primary-domain selection. Those also depend on shop capabilities and eligibility. Neither mutation reports activation or certificate readiness. Do not use them to poll for activation or mark the storefront fully active from their responses. Check your platform's hostname attachment, deployment and HTTPS separately.

Keep API endpoints, checkout URLs and customer-account URLs under their existing Shopify contracts. Do not rewrite them or append arbitrary Shopify paths to the external hostname.

## Handle failures and reruns

Use the returned error details to choose a recovery action; a rejection is not necessarily HTTP 403 or a bad token.

- `FEATURE_NOT_ENABLED` or access rejection: confirm onboarding access for the selected app/shop.
- `APP_NOT_INSTALLED`: check the installation, you may need to initiate an OAuth flow
- Host validation, connection conflicts, `EXTERNAL_STOREFRONT_DOMAIN_NOT_ENTITLED_ERROR` or `MAXIMUM_EXTERNAL_DOMAINS_ERROR`: resolve the reported hostname, entitlement or domain-limit issue before retrying.
- `PUBLISHED_BY_ANOTHER_API_CLIENT`: an incomplete verification belongs to another app; resolve publishing-app ownership.
- `DOMAIN_VERIFICATION_NOT_FOUND`: check the saved host and shop/app identity, and whether publish returned the empty-record branch that skips verification.

For recoverable transport, throttling or transient DNS/projection failures, use controlled backoff under the [Admin API error guidance](https://shopify.dev/docs/api/admin-graphql/unstable). Top-level `UNAVAILABLE` can indicate a transient DNS/projection failure. An error or lost response may follow a partial side effect, so do not assume the request made no change or that every mutation is safe to retry.

After a DNS correction propagates, you can run verify again subject to API rate/error handling. For expired or terminally failed verification, a deliberate re-publish may be needed and may return new records. Always use the fresh response values.

Do not use publish as a status poll. For development hosts eligible for direct connection without TXT verification, publishing a changed hostname can remove the same app's superseded hosts. Treat a hostname change as a configuration change.

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
- [Technical Reference](../technical_reference/glossary.md)
  - [Glossary](../technical_reference/glossary.md)
  - [Understanding the Two-App Architecture](../technical_reference/two_app_architecture.md)
  - [Security Criteria](../technical_reference/security_criteria.md)
  - [Getting Started](../technical_reference/getting_started.md)
  - [Partner App: Managing Dev Stores](../technical_reference/partner_app.md)
  - [Your Sales Channel App: Accessing Store APIs](../technical_reference/sales_channel_app.md)
  - [Connect an external storefront domain](../technical_reference/connect_external_storefront_domain.md)
  - [Connect Existing Merchants](../technical_reference/connect_existing_merchants.md)
  - [Changelog](../technical_reference/changelog.md)
