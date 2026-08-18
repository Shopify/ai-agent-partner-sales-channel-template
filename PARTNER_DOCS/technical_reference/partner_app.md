# Partner App: Managing Dev Stores

The Partner App manages the lifecycle of dev stores you create for your platform's users. Using the global access token generated from this app's credentials, you can create, transfer, and check the status of dev stores programmatically. All operations in this section use the Partner App's Client ID and Client Secret.

This is the app you create in your Partner Dashboard. It authenticates with the Partners API and allows you to:

- Create dev stores programmatically
- Generate claim URLs for store transfers
- Manage the lifecycle of stores you create for your users

You will need to share this app's Client ID with Shopify so we can grant it permission to call the Vibe Store APIs.

## Generate a Global Access Token

Use the Client ID and Client Secret from the App you created in your Partner Dashboard to generate this Global API token:

```sh
curl --location 'https://api.shopify.com/auth/access_token' \
--header 'Content-Type: application/json' \
--data '{
  "client_id": "$PARTNER-APP-CLIENT-ID",
  "client_secret": "$PARTNER-APP-CLIENT-SECRET",
  "grant_type": "client_credentials"
}'
```

Example Response:

```json
{
    "access_token": "eyJ0...Wme"
}
```

You'll use the access token in this response to create shops and transfer ownership. This token has a ~60 minute TTL.

## Create a Dev Store

```sh
curl --location 'https://partners.shopify.com/api/dev_stores' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $GLOBAL-ACCESS-TOKEN' \
--data '{
    "store_name": "$YOUR-STORE-NAME",
    "autoinstall_client_id": "$PARTNER-SHOP-APP-CLIENT-ID"
}'
```

It's strongly recommended to suffix a short hash to the store name to avoid name conflicts, e.g. `my-shoe-store-4ec2fe`.

> **Note:** The `autoinstall_client_id` parameter automatically installs your Sales Channel App on each new dev store, but this only works after your app has passed Shopify's app review. During development, you will need to omit this parameter and install your Sales Channel App on dev stores manually using the Shopify CLI.

Example Response:

```json
{
    "success": true,
    "shop_id": 12345678,
    "shop_permanent_domain": "my-shoe-store-4ec2fe.myshopify.com"
}
```

You'll use `shop_permanent_domain` later when requesting a Claim Store URL.

## Transfer a Dev Store

Once the user is ready to make their store real and start selling, you can generate a Claim Store URL for them to create (or sign in to) their own Shopify Account and start their 3-day free Shopify trial.

A key (but optional) part of this is the `storefront_redirect_url` which should be a stable URL that points to the public-facing storefront that's served externally.

```sh
curl --location 'https://partners.shopify.com/api/dev_store_transfers' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $GLOBAL-ACCESS-TOKEN' \
--data-raw '{
    "shop_permanent_domain": "$SHOP-PERMANENT-DOMAIN",
    "email_address": "$VIBE-CODING-MERCHANT-EMAIL",
    "first_name": "$VIBE-CODING-MERCHANT-FIRST-NAME",
    "last_name": "$VIBE-CODING-MERCHANT-LAST-NAME",
    "storefront_redirect_url": "https://public-facing-storefront.example.com/"
}'
```

Example Response:

```json
{
    "success": true,
    "claim_store_url": "https://$SHOP-PERMANENT-DOMAIN.myshopify.com/admin/auth/accept/123/8446...3fa?identity_token=none"
}
```

> **Note:** The invited user will also receive an email which contains the link above that allows them to take ownership of the store.

## Check Store Transferability

Before initiating a transfer, you can check whether a dev store is eligible for transfer. This is useful for verifying that a store hasn't already been transferred or already claimed by the user.

The "status" field returns a string with one of the following values:
- "ready": the shop is transferable.
- "pending": the shop is still being set up and is NOT ready for transfer yet.
- "not_transferable": the shop cannot be transferred.


```sh
curl --location 'https://partners.shopify.com/api/dev_store_transfer_status?shop_permanent_domain=$SHOP-PERMANENT-DOMAIN' \
--header 'Authorization: $GLOBAL-ACCESS-TOKEN'
```

Example Response:

```json
{
    "transferable": true,
    "status": "ready"
}
```

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
