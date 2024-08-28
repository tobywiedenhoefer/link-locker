import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import LockerCard from "../../components/LockerCard/LockerCard";
import SearchLockedLockersButton from "../../components/SearchLockedLockersButton/SearchLockedLockersButton";
import AddLockerButton from "../../components/AddLockerButton/AddLockerButton";

import Locker from "../../types/locker.type";

import { getLockers } from "../../store/data.store";
import { ErrorCodes } from "../../shared/errors";
import { default as swf } from "../../constants/submissionWorkflows";

import "./Lockers.css";
import "../../shared/loading.css";

export default function Lockers() {
  const [lockers, setLockers] = useState<Array<Locker>>([]);
  const [workflow, setWorkflow] = useState<swf>(swf.default);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      switch (workflow) {
        case swf.default: {
          const resp = await getLockers();
          if (resp.success) {
            setLockers(resp.payload);
            setWorkflow(swf.success);
          } else if (resp.errorCode === ErrorCodes.CacheExpiredOrNotSet) {
            toast.error("Session timed out, logging out...", {
              position: "bottom-right",
              draggable: true,
            });
            navigate("/logout");
          } else {
            setWorkflow(swf.failure);
          }
          break;
        }
        case swf.failure: {
          toast.error(
            "An unknown error has occurred. Please try again later.",
            {
              position: "bottom-right",
              draggable: true,
            }
          );
          setWorkflow(swf.default);
          break;
        }
      }
    })();
  }, [workflow, lockers]);
  const handleNewLockerSubmission = (locker: Locker) => {
    setLockers([...lockers, locker]);
  };
  return (
    <div className="locker-cards">
      {workflow === swf.success ? (
        lockers.map((locker) => {
          return <LockerCard key={locker.id} locker={locker} />;
        })
      ) : (
        <div className="loading-spinner" />
      )}
      <div className="locker-buttons-row">
        <AddLockerButton handleSubmit={handleNewLockerSubmission} />
        <SearchLockedLockersButton />
      </div>
    </div>
  );
}
