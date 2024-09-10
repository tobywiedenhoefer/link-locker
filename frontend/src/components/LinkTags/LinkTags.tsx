import LinkTag from "../LinkTag/LinkTag";
import Tag from "../../types/tag.type";

import "./LinkTags.css";

type LinkTagsProps = {
  tags: Tag[];
};
export default function LinkTags(props: LinkTagsProps) {
  return (
    <div className="link-card-tags">
      {props.tags.map((tag, ind) => {
        if (ind > 4) {
          return;
        }
        return <LinkTag key={tag.id} name={tag.name} ind={ind} />;
      })}
    </div>
  );
}
