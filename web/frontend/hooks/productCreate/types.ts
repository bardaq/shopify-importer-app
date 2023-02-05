export interface IProduct {
  title: string;
  descriptionHtml: string;
  seo: {
    title: string;
    description: string;
  };
  collectionsToJoin: string[];
  options: string[];
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
