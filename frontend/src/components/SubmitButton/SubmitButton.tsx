import "./SubmitButton.css";

type SubmitButtonProps = { disabled: boolean; handleSubmit: () => void };
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
        Submit
      </button>
    </div>
  );
}
