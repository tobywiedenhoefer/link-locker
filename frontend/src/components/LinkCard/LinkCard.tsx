import Link from "../../types/link.type";
import LinkTag from "../LinkTag/LinkTag";

import "./LinkCard.css";

type LinkCardProps = {
  link: Link;
  onClick: () => void;
};
export default function LinkCard({ link, onClick }: LinkCardProps) {
  return (
    <div className="link-card" onClick={onClick}>
      <div className="link-card-text">{link.name}</div>
      <div className="link-card-tags">
        {link.tags.map((tag, ind) => {
          if (ind > 4) {
            return;
          }
          return <LinkTag key={`link-tag-${ind}`} name={tag} ind={ind} />;
        })}
      </div>
    </div>
  );
}
