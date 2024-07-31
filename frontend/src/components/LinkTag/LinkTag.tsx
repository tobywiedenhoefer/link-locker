import "./LinkTag.css";

type LinkTagProps = {
  name: string;
  ind: number;
};

export default function LinkTag({ name }: LinkTagProps) {
  return <span className="tag">{name}</span>;
}
