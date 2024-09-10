import Tag from "./tag.types";

type Link = {
  id: number;
  url: string;
  name: string;
  tags: Tag[];
};

export default Link;
