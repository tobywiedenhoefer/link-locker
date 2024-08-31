import LinkTag from "../LinkTag/LinkTag";

import "./LinkTags.css";

type LinkTagsProps = {
  tags: string[];
};
export default function LinkTags(props: LinkTagsProps) {
  return (
    <div className="link-card-tags">
      {props.tags.map((tag, ind) => {
        if (ind > 4) {
          return;
        }
        return <LinkTag key={`link-tag-${ind}`} name={tag} ind={ind} />;
      })}
    </div>
  );
}
