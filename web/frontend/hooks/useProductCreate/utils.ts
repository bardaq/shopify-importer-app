import { gql, useQuery } from "@apollo/client";
import { IProduct, IProductDetails, IProductVariant } from "../../types/index";

export const transformProduct = (product: IProductDetails): IProduct => {
  const productTitle = product.title;
  const productDescriptionHtml = product.description_HTML;
  const seoTitle = product.meta.title;
  const options = product.options.includes("База (базис) фарби")
    ? product.options.filter((o) => !o.includes("База (базис) фарби"))
    : product.options;
  const seoDescription = product.meta.description;
  const variants = transformVariants(product.variants, product.images);
  const images = product.images.map((image) => ({ src: image })); // images:[{src:/fasfafa.jpg}}

  return {
    title: productTitle,
    descriptionHtml: productDescriptionHtml,
    seo: {
      title: seoTitle,
      description: seoDescription,
    },
    handle: product.slug,
    collectionsToJoin: [],
    options: options as string[],
    variants: variants,
    metafields: product.metafields,
    images: images,
    vendor: product.vendor,
  };
};

const transformVariants = (variants: IProductVariant[], images: string[]) => {
  const transformedVariants = [];

  // const unique = Array.from(new Set(variants));

  // console.log(unique);
  variants.forEach((variant, index) => {
    transformedVariants.push({
      options: variant.options,
      price: variant.price.toString(),
      sku: variant.sku.toString(),
      imageSrc: images[index],
    });
  });

  return transformedVariants;
};
