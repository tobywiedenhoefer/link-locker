import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { getLinks, getLockedLinks } from "../../store/data.store";
import Link from "../../types/link.type";
import ApiResponse from "../../types/apiResponse.type";
import LockerState from "../../types/lockerState.type";
import { filterLinkSubstring } from "../../shared/filterSearch";
import { ErrorCodes } from "../../shared/errors";
import { default as swf } from "../../constants/submissionWorkflows";

import LinkCard from "../../components/LinkCard/LinkCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import ViewLinkModal from "../../components/ViewLinkModal/ViewLinkModal";
import LockerEditButton from "../../components/LockerEditButton/LockerEditButton";
import NewLinkCard from "../../components/NewLinkCard/NewLinkCard";

import "./Locker.css";
import "../../shared/loading.css";

export default function Locker() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [links, setLinks] = useState<Array<Link>>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>();
  const [editStatus, setEditStatus] = useState<"edit" | "view">("view");
  const [workflow, setWorkflow] = useState<swf>(swf.default);
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedLink(null);
  };
  useEffect(() => {
    (async () => {
      const state: LockerState | null | undefined = location.state;
      switch (workflow) {
        case swf.default: {
          const lockerId = params?.locker ? +params.locker : NaN;
          let resp: ApiResponse<Link[]>;
          if (!state) {
            resp = await getLinks(lockerId);
          } else {
            resp = await getLockedLinks(lockerId, state);
          }
          if (resp.success) {
            setLinks(resp.payload);
            setWorkflow(swf.success);
          } else if (resp.errorCode === ErrorCodes.CacheExpiredOrNotSet) {
            navigate("/logout", { replace: true });
          } else if (resp.errorCode === ErrorCodes.CouldNotFindLockers) {
            navigate("/", { replace: true });
          } else {
            console.log("error: ", resp);
            setWorkflow(swf.failure);
          }
          break;
        }
      }
    })();
  }, [links, workflow]);
  return (
    <>
      <div className="search-bar-row">
        <SearchBar setFilter={setSearchTerm} />
        <LockerEditButton
          changeStatus={() =>
            setEditStatus(editStatus === "view" ? "edit" : "view")
          }
          status={editStatus}
        />
      </div>
      <div className="link-cards-container">
        {workflow !== swf.default ? (
          links
            .filter((link) => filterLinkSubstring(link, searchTerm))
            .map((link) => {
              return (
                <LinkCard
                  key={link.id}
                  link={link}
                  onClick={() => {
                    setSelectedLink(link);
                    setShowModal(true);
                  }}
                />
              );
            })
        ) : (
          <div className="spinner-container">
            <div className="loading-spinner" />
          </div>
        )}
        {editStatus === "edit" ? (
          <NewLinkCard
            lockerId={params?.locker !== undefined ? +params.locker : NaN}
            handleSubmit={(link: Link) => {
              links.push(link);
              setEditStatus("view");
            }}
          />
        ) : null}
      </div>
      <ViewLinkModal
        show={showModal}
        handleClose={handleModalClose}
        link={selectedLink}
      />
    </>
  );
}
