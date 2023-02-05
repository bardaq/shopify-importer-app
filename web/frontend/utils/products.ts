import { IProduct } from "../hooks/productCreate/types";
import { getCollections } from "./collections";
import { IProductDetails, IProductVariant } from "./types";

export const transformProducts = (products: IProductDetails[]) => {
  const transformedProducts: IProduct[] = [];

  products.forEach((product) => {
    const productTitle = product.title;
    const productDescriptionHtml = product.description_HTML;
    const seoTitle = product.meta.title;
    const seoDescription = product.meta.description;
    const collectionSlug = product.collectionSlug;
    const collectionsToJoin = getCollectionUrl(collectionSlug);
    const productOptions = product.options;
    const variants = transformVariants(product.variants, product.images);
    const metafields = product.metafields;
    const images = transformImages(product.images); // images:[{src:/fasfafa.jpg}}

    transformedProducts.push({
      title: productTitle,
      descriptionHtml: productDescriptionHtml,
      seo: {
        title: seoTitle,
        description: seoDescription,
      },
      collectionsToJoin: collectionsToJoin,
      options: productOptions,
      variants: variants,
      metafields: metafields,
      images: images,
    });
  });
  return transformedProducts;
};

const getCollectionUrl = (collectionSlug) => {
  const collectionsToJoin = [];
  const collections = getCollections();
  for (const collection of collections) {
    if (collection.title == collectionSlug) {
      collectionsToJoin.push(collection.id);
    }
  }
  return collectionsToJoin;
};

const transformImages = (images: string[]) => {
  const transformedImages = [];
  images.forEach((image) => {
    transformedImages.push({
      src: image,
    });
  });
  return transformedImages;
};

const transformVariants = (variants: IProductVariant[], images: string[]) => {
  const transformedVariants = [];
  variants.forEach((variant, index) => {
    transformedVariants.push({
      ...variant,
      price: variant.price.toString(),
      sku: variant.sku.toString(),
      imageSrc: images[index],
    });
  });
  return transformedVariants;
};
