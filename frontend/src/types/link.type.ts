import Tag from "./tag.type";

type Link = {
  id: number;
  url: string;
  name: string;
  tags: Tag[];
};

export default Link;
