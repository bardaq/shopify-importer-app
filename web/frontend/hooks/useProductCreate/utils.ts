import { IProduct, IProductDetails, IProductVariant } from "../../types/index";

export const transformProduct = (product: IProductDetails): IProduct => {
  const productTitle = product.title;
  const productDescriptionHtml = product.description_HTML;
  const seoTitle = product.meta.title;
  const seoDescription = product.meta.description;
  const productOptions = product.options;
  const variants = transformVariants(product.variants, product.images);
  const metafields = product.metafields.map((metafield) => ({
    ...metafield,
    namespace: metafield.key,
  }));
  const images = product.images.map((image) => ({ src: image })); // images:[{src:/fasfafa.jpg}}

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
    vendor: product.vendor,
  };
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
