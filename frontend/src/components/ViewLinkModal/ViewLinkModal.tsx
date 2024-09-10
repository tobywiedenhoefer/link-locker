import Link from "../../types/link.type";

import Modal, { ModalProps } from "../Modal/Modal";

import "../ViewLinkModal/ViewLinkModal.css";

type ViewLinkModalProps = {
  link: Link | null | undefined;
} & ModalProps;

export default function ViewLinkModal({
  link,
  show,
  handleClose,
}: ViewLinkModalProps) {
  return !!link ? (
    <Modal show={show} handleClose={handleClose}>
      <div className="modal-content">
        <div className="view-modal-container">
          <div className="view-modal-left">
            <div className="vertically-center-title">
              <div className="modal-title-container">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </div>
            </div>
          </div>
          <div className="view-modal-right">
            <h3>Tags</h3>
            <div className="tags-container">
              {link.tags.map((tag) => (
                <span key={tag.id} className="tag">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  ) : null;
}
