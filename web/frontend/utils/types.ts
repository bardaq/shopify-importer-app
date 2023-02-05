export interface IProductMetaData {
  alternate: { href: string; hrefLang: string }[];
  title: string;
  keywords: string;
  description: string;
  canonical: string;
}

export interface IProductVariant {
  price: number;
  sku: number;
  options: string[];
}

export interface IProductMetafield {
  namespace: string;
  key: string;
  type: string;
  value: string | number | string[] | number[];
}
export interface IProductDetails {
  collectionSlug: string; // <——
  meta: IProductMetaData;
  title: string;
  slug: string;
  url: string;
  lang: string;
  images: string[];
  description_HTML: string;
  sku: number;
  vendor: string;
  options: string[]; // ❤️ items
  variants: IProductVariant[];
  metafields: IProductMetafield[];
}
