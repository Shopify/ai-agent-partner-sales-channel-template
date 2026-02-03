import {
  BlockStack,
  Card,
  InlineStack,
  Text,
  Button,
} from "@shopify/polaris";
import { ExternalIcon } from "@shopify/polaris-icons";
import type { PartnerConfigSerializable } from "../config";
import { useTranslation } from "react-i18next";

interface SupportCardProps {
  partnerConfig: PartnerConfigSerializable;
}

export function SupportCard({ partnerConfig }: SupportCardProps) {
  const { t } = useTranslation("LandingPage");

  return (
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
  );
}
