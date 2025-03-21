import { Form, Button } from "react-bootstrap";
import StarRating from "../starRating/StarRating";

const ReviewForm = ({
  handleSubmit,
  revText,
  labelText,
  defaultValue,
  rating,
  setRating,
  submitButtonText = "Submit",
}) => {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>{labelText}</Form.Label>
        <Form.Control
          ref={revText}
          as="textarea"
          rows={3}
          defaultValue={defaultValue}
        />
      </Form.Group>

      <div className="mb-3">
        <StarRating rating={rating} setRating={setRating} />
      </div>

      <Button variant="outline-info" onClick={handleSubmit}>
        {submitButtonText}
      </Button>
    </Form>
  );
};

export default ReviewForm;
