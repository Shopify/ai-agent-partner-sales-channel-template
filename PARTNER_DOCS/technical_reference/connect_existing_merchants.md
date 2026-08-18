# Connect Existing Merchants

In order to enable connection to an existing store you must set a post authentication callback URL in the app config, example: `https://shopify.{partner}.dev/callback`. In order to kick off this flow, you must first obtain the merchant's Shopify admin domain (as an example `https://admin.shopify.com/store/my-cool-sneaker-shop`). You will then trigger a redirect as follows:

```
https://admin.shopify.com/store/{SHOP_NAME}/oauth/authorize?client_id={CLIENT_ID}&grant_type[]=per_user&state={STATE_PARAM}&redirect_uri=https://{YOUR_APP_HOST}/auth/platform/callback
```

```typescript
interface Parameters {
  CLIENT_ID: string; // Your Sales Channel App client ID
  STATE: {
    // This parameter is required, you may add anything else you need
    // but at the minimum we require a permanent url back to the project
    projectUrl: string;
  };
}
```

After the merchant has authenticated they will be directed back to the redirect URI you provided in the `config.ts`.

## Response

```
https://{YOUR_CALLBACK_URL}?code={ACCESS_CODE}&hmac={HMAC}&shop={SHOPIFY_PERMANENT_DOMAIN}&state={STATE}&timestamp={RESPONSE_TIME}
```

At this point you should validate the request authenticity by checking the HMAC against the other parameters. There is an example [in the dev docs here](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant#step-1-verify-the-installation-request). The returned state parameter will be the same as the one you used to initiate the request. With this state you should be able to tie the callback back to the original request. You can now exchange the `ACCESS_CODE` for an `ACCESS_TOKEN`.

```sh
curl --location 'https://{SHOPIFY_PERMANENT_DOMAIN}/admin/oauth/access_token' \
--header 'Content-Type: application/json' \
--data '{
    "client_id": "$SALES-CHANNEL-APP-CLIENT-ID",
    "client_secret": "$SALES-CHANNEL-APP-CLIENT-SECRET",
    "code": "$CODE-FROM-REDIRECT-URL"
}'
```

> **Note:** You must use your Sales Channel App client ID and client secret.

The access token returned from this exchange is an Online Access Token. Use it for all requests to the Shopify Admin GraphQL API. For details on the different token types, see the [Understanding Access Tokens](sales_channel_app.md#understanding-access-tokens) section above.

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
