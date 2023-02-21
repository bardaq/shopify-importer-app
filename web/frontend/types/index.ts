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

export interface IProduct {
  title: string;
  descriptionHtml: string;
  seo: {
    title: string;
    description: string;
  };
  handle: string;

  options: string[];
  vendor: string;
  images: {
    src: string;
  }[];
  variants: {
    price: string;
    options: string[];
    imageSrc: string;
  }[];
  metafields: {
    namespace: string;
    type: string;
    key: string;
    value: string | number | string[] | number[];
  }[];
}

export interface ITransformedVariants {
  options: string[];
  price: string;
  sku: string;
  imageSrc: string;
}
