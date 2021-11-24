import React from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";

function ContextInput(props) {
  const { t } = useTranslation();

  const context_length = props.context.split(" ").length;

  return (
    <Form.Group className="context-inputs mb-3">
      <Form.Label htmlFor={`context-input-${props.id}`}>
        {props.label ? props.label : t("Context")}
      </Form.Label>
      <Form.Control
        as="textarea"
        id={`context-input-${props.id}`}
        rows="10"
        value={props.context}
        placeholder="Input context/paragraph here"
        onChange={props.onChange}
        disabled={props.disabled}
      />
      {props.helpText && <Form.Text muted>{props.helpText}</Form.Text>}
      <br />
      {props.textCount &&
        (context_length >= 512 ? (
          <Form.Text className="text-danger fw-bolder">
            {context_length} / 512
          </Form.Text>
        ) : (
          <Form.Text muted>{context_length} / 512</Form.Text>
        ))}
    </Form.Group>
  );
}

export default ContextInput;
