import { IProductDetails, IProductVariant } from "../../types/types";

export const transformProduct = (product: IProductDetails) => {
  const productTitle = product.title;
  const productDescriptionHtml = product.description_HTML;
  const seoTitle = product.meta.title;
  const seoDescription = product.meta.description;
  const productOptions = product.options;
  const variants = transformVariants(product.variants, product.images);
  const metafields = product.metafields;
  const images = transformImages(product.images); // images:[{src:/fasfafa.jpg}}

  return {
    title: productTitle,
    descriptionHtml: productDescriptionHtml,
    seo: {
      title: seoTitle,
      description: seoDescription,
    },
    collectionsToJoin: [],
    options: productOptions,
    variants: variants,
    metafields: metafields,
    images: images,
  };
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
