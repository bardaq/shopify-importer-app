export interface ICollection {
  title: string;
  descriptionHtml: string;
  handle: string;
  image: {
    src: string;
  };
  seo: {
    title: string;
    description: string;
  };
}
