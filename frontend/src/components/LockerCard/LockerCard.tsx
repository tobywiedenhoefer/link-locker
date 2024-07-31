import { useNavigate } from "react-router";

import { default as LockerType } from "../../types/locker.type";
import "./LockerCard.css";

type LockerProps = {
  locker: LockerType;
};

export default function LockerCard({ locker }: LockerProps) {
  const navigate = useNavigate();
  return (
    <div
      className="locker-card"
      onClick={() => {
        navigate(`/lockers/locker/${locker.id}`);
      }}
      tabIndex={0}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.code === "Space") {
          navigate(`locker/${locker.id}`, { relative: "route" });
        }
      }}
    >
      {locker.name}
    </div>
  );
}
