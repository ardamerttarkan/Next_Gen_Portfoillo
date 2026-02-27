/**
 * useSEO — Dinamik meta tag yönetimi (Open Graph, Twitter Card, document.title)
 * react-helmet gerektirmez; doğrudan DOM'u günceller.
 */
import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

function upsertMeta(
  attrKey: "name" | "property",
  attrValue: string,
  content: string,
): void {
  let el = document.querySelector(
    `meta[${attrKey}="${attrValue}"]`,
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrKey, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSEO({
  title,
  description,
  image,
  url,
  type = "website",
}: SEOProps = {}): void {
  useEffect(() => {
    const siteName = "Arda Mert Tarkan";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const desc =
      description ||
      "Arda Mert Tarkan'ın kişisel portfolyosu — teknoloji, tasarım ve hayat.";
    const pageUrl = url || window.location.href;
    const pageImage = image || "/img/og-default.png";

    // Temel
    document.title = fullTitle;
    upsertMeta("name", "description", desc);

    // Open Graph
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:url", pageUrl);
    upsertMeta("property", "og:image", pageImage);
    upsertMeta("property", "og:site_name", siteName);

    // Twitter Card
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", pageImage);
  }, [title, description, image, url, type]);
}
