import { useGetPublicSiteSettings } from "@workspace/api-client-react";

export interface BrandSettings {
  siteName: string;
  logoUrl: string;
  primaryColor: string;
  tagline: string;
  discordUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  supportEmail: string;
  billingEmail: string;
  heroBgUrl: string;
  heroOverlayOpacity: number;
  announcementEnabled: boolean;
  announcementText: string;
  announcementColor: string;
}

export function useBrandSettings(): BrandSettings {
  const { data } = useGetPublicSiteSettings();
  const kv = (data ?? {}) as Record<string, string>;

  return {
    siteName: kv.brand_site_name || "ArveX",
    logoUrl: kv.brand_logo_url || "",
    primaryColor: kv.brand_primary_color || "",
    tagline: kv.brand_tagline || "",
    discordUrl: kv.brand_discord_url || "",
    twitterUrl: kv.brand_twitter_url || "",
    youtubeUrl: kv.brand_youtube_url || "",
    supportEmail: kv.brand_support_email || "support@arvexhosting.com",
    billingEmail: kv.brand_billing_email || "billing@arvexhosting.com",
    heroBgUrl: kv.brand_hero_bg_url || "",
    heroOverlayOpacity: parseFloat(kv.brand_hero_overlay_opacity || "0.75"),
    announcementEnabled: kv.brand_announcement_enabled === "true",
    announcementText: kv.brand_announcement_text || "",
    announcementColor: kv.brand_announcement_color || "primary",
  };
}
