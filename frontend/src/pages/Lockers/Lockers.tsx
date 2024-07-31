import { useEffect, useState } from "react";

import LockerCard from "../../components/LockerCard/LockerCard";
import SearchLockedLockersButton from "../../components/SearchLockedLockersButton/SearchLockedLockersButton";
import AddLockerButton from "../../components/AddLockerButton/AddLockerButton";

import Locker from "../../types/locker.type";

import { useAuth } from "../../contexts/AuthContext";
import { getLockers } from "../../store/data.store";

import "./Lockers.css";

export default function Lockers() {
  const { token } = useAuth();
  const [lockers, setLockers] = useState<Array<Locker>>([]);
  useEffect(() => {
    (async () => {
      const resp = await getLockers(token);
      if (resp.success) {
        setLockers(resp.payload);
      } else {
        console.error("Error:", resp.errorMessage);
      }
    })();
  }, [lockers]);
  const handleNewLockerSubmission = (locker: Locker) => {
    setLockers([...lockers, locker]);
  };
  return (
    <div className="locker-cards">
      {lockers.map((locker) => {
        return <LockerCard key={locker.id} locker={locker} />;
      })}
      <div className="locker-buttons-row">
        <AddLockerButton handleSubmit={handleNewLockerSubmission} />
        <SearchLockedLockersButton />
      </div>
    </div>
  );
}
