import {
  BlockStack,
  Card,
  InlineStack,
  Page,
  Text,
  Button,
  Box,
  Link,
  Icon,
} from "@shopify/polaris";
import { ExternalIcon, ViewIcon } from "@shopify/polaris-icons";
import type { PartnerConfigSerializable } from "../config";
import { useTranslation } from "react-i18next";
import { ProductsPublishedCard } from "./ProductPublishingCard";
import type { ComponentProps } from "react";

interface HomePageProps {
  shop: string;
  partnerConfig: PartnerConfigSerializable;
  publishedProductsInfo:
    | ComponentProps<typeof ProductsPublishedCard>["publishedProductsInfo"]
    | null;
  partnerProjectLinks: {
    projectFrontendUrl: string | null;
    projectManagementUrl: string | null;
  };
}

export default function AppPage({
  shop,
  partnerConfig,
  publishedProductsInfo,
  partnerProjectLinks,
}: HomePageProps) {
  const { t } = useTranslation("LandingPage");
  const logo = partnerConfig.logo?.startsWith("<svg") ? (
    <div
      dangerouslySetInnerHTML={{
        __html: partnerConfig.logo.replace(
          "<svg",
          '<svg style="height: 16px; width: 16px;"',
        ),
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 0,
      }}
    />
  ) : (
    <img
      src={partnerConfig.logo}
      alt={partnerConfig.name}
      style={{
        height: "16px",
        width: "16px",
        objectFit: "contain",
      }}
    />
  );
  const title = (
    <InlineStack gap="200" blockAlign="center">
      {t("heading", { logo, partnerName: partnerConfig.name })}
    </InlineStack>
  );
  return (
    <Page
      title={title as unknown as string}
      primaryAction={{
        content: t("goTo", { partnerName: partnerConfig.name }),
        url: partnerConfig.docsUrl !== "#" ? partnerConfig.docsUrl : undefined,
        external: true,
        icon: ExternalIcon,
      }}
    >
      <BlockStack gap="500">
        {/* Project Details Card */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              {t("projectDetails")}
            </Text>

            <BlockStack gap="100">
              <InlineStack gap="400" align="space-between" blockAlign="center">
                <Text as="span" variant="bodyMd" fontWeight="medium">
                  {t("project", { partnerName: partnerConfig.name })}
                </Text>

                {partnerProjectLinks.projectManagementUrl ? (
                  <Link url={partnerProjectLinks.projectManagementUrl}>
                    <InlineStack gap="100" blockAlign="center">
                      <Icon source={ExternalIcon} tone="interactive" />
                      {t("editIn", { partnerName: partnerConfig.name })}
                    </InlineStack>{" "}
                  </Link>
                ) : null}
              </InlineStack>
              <Box
                background="bg-surface-secondary"
                borderColor="border"
                borderWidth="025"
                borderRadius="200"
                padding="200"
                minHeight="36px"
              >
                <InlineStack
                  align="space-between"
                  blockAlign="center"
                  wrap={false}
                >
                  <Text as="span" variant="bodyMd" tone="subdued">
                    {partnerProjectLinks.projectFrontendUrl}
                  </Text>
                  {partnerProjectLinks.projectFrontendUrl ? (
                    <Box minWidth="20px">
                      <Link
                        url={partnerProjectLinks.projectFrontendUrl}
                        target="_blank"
                      >
                        <Icon source={ViewIcon} tone="subdued" />
                      </Link>
                    </Box>
                  ) : null}
                </InlineStack>
              </Box>
            </BlockStack>

            <BlockStack gap="100">
              <Text as="span" variant="bodyMd" fontWeight="medium">
                {t("currentShopifyStore")}
              </Text>
              <Box
                background="bg-surface-secondary"
                borderColor="border"
                borderWidth="025"
                borderRadius="200"
                padding="200"
                minHeight="36px"
              >
                <InlineStack
                  align="space-between"
                  blockAlign="center"
                  wrap={false}
                >
                  <Text as="span" variant="bodyMd" tone="subdued">
                    {shop}
                  </Text>
                  <Box minWidth="20px">
                    <Link url={`https://${shop}`} target="_blank">
                      <Icon source={ViewIcon} tone="subdued" />
                    </Link>
                  </Box>
                </InlineStack>
              </Box>
            </BlockStack>
          </BlockStack>
        </Card>

        {/* Products Published Card */}
        {publishedProductsInfo ? (
          <ProductsPublishedCard
            partnerConfig={partnerConfig}
            publishedProductsInfo={publishedProductsInfo}
          />
        ) : null}

        {/* Support Section */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              {t("support")}
            </Text>

            {/* Partner specific Support */}
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="100">
                <Text as="h3" variant="headingSm">
                  {t("partnerSupport", { partnerName: partnerConfig.name })}
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  {t("partnerSupportDescription", {
                    partnerName: partnerConfig.name,
                  })}
                </Text>
              </BlockStack>
              <Button
                url={partnerConfig.supportUrl}
                external
                icon={ExternalIcon}
              >
                {t("partnerSupport", { partnerName: partnerConfig.name })}
              </Button>
            </InlineStack>

            {/* Partner x Shopify Documentation */}
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="100">
                <Text as="h3" variant="headingSm">
                  {t("partnerDocsTitle", { partnerName: partnerConfig.name })}
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  {t("partnerDocsDescription", {
                    partnerName: partnerConfig.name,
                  })}
                </Text>
              </BlockStack>
              <Button url={partnerConfig.docsUrl} external icon={ExternalIcon}>
                {t("partnerDocumentation", { partnerName: partnerConfig.name })}
              </Button>
            </InlineStack>

            {/* Shopify Support */}
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="100">
                <Text as="h3" variant="headingSm">
                  {t("shopifySupport")}
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  {t("shopifySupportDescription")}
                </Text>
              </BlockStack>
              <Button
                url="https://help.shopify.com/"
                external
                icon={ExternalIcon}
              >
                {t("shopifySupport")}
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* Footer - Terms and Conditions */}
        <Box paddingBlockStart="100" paddingBlockEnd="400">
          <InlineStack align="center">
            <Text as="span" variant="bodySm" tone="subdued">
              <Link url={partnerConfig.termsOfServiceUrl} external>
                {t("termsAndConditions", { partnerName: partnerConfig.name })}
              </Link>
            </Text>
          </InlineStack>
        </Box>
      </BlockStack>
    </Page>
  );
}
