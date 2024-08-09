import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { getLinks, getLockedLinks } from "../../store/data.store";
import Link from "../../types/link.type";
import ApiResponse from "../../types/apiResponse.type";
import LockerState from "../../types/lockerState.type";
import { filterLinkSubstring } from "../../shared/filterSearch";

import { useAuth } from "../../contexts/AuthContext";

import LinkCard from "../../components/LinkCard/LinkCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import ViewLinkModal from "../../components/ViewLinkModal/ViewLinkModal";
import LockerEditButton from "../../components/LockerEditButton/LockerEditButton";
import NewLinkCard from "../../components/NewLinkCard/NewLinkCard";

import "./Locker.css";

export default function Locker() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [links, setLinks] = useState<Array<Link>>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>();
  const [editStatus, setEditStatus] = useState<"edit" | "view">("view");
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedLink(null);
  };
  useEffect(() => {
    (async () => {
      const state: LockerState | null | undefined = location.state;
      const lockerId = params?.locker !== undefined ? +params?.locker : NaN;
      let resp: ApiResponse<Link[]>;
      if (typeof state === "undefined" || state === null) {
        resp = await getLinks(token, lockerId);
      } else {
        resp = await getLockedLinks(token, lockerId, state);
      }
      if (resp.success) {
        setLinks(resp.payload);
      } else {
        navigate("/", { replace: true });
      }
    })();
  }, [links]);
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
        {links
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
          })}
        {editStatus === "edit" ? (
          <NewLinkCard
            lockerId={params?.locker!}
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
