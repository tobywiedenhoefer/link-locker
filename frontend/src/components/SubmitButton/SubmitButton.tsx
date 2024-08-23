import "./SubmitButton.css";
import "../../shared/loading.css";

type SubmitButtonProps = {
  disabled: boolean;
  handleSubmit: () => void;
  isLoading?: boolean;
};
export default function SubmitButton(props: SubmitButtonProps) {
  return (
    <div className="submit-button-wrapper">
      <button
        className="submit-form-button"
        disabled={props.disabled}
        onClick={() => props.handleSubmit()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.code === "Space") {
            props.handleSubmit();
          }
        }}
      >
        {!props.isLoading ? (
          "Submit"
        ) : (
          <div className="button-loading-container">
            <div className="button-loading-spinner" />
          </div>
        )}
      </button>
    </div>
  );
}
