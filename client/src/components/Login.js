import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Lock } from "react-bootstrap-icons";

export default function Login() {
  const initialState = {
    email: "",
    password: "",
  };
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    setIsSubmit(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmit(true);
    if (validate(formValues)) {
      let payload = {
        email: formValues.email,
        password: formValues.password,
      };
      fetch("http://localhost:3031/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "ok") {
            localStorage.setItem("token", data.token);
            window.location = "/gallery";
          } else {
            alert("Login Failed.");
          }
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
      setIsSubmit(false);
    }
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be more than 6 characters";
    } else if (values.password.length > 12) {
      errors.password = "Password cannot exceed more than 12 characters";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Container className="flex-center">
      <Card className="my-5 p-4 card-sm">
        <Form.Floating>
          <div className="flex-center">
            <span className="icons-circle">
              <Lock size={25} color="white" />
            </span>
          </div>
          <h5 className="text-center form-header">Login form</h5>
          <Form.Group controlId="formEmail">
            <Form.Label className="mt-3 text-left">Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              defaultValue={formValues.email}
            />
            <p className="text-danger">{formErrors.email}</p>
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label className="mt-3">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              defaultValue={formValues.password}
            />
            <p className="text-danger">{formErrors.password}</p>
          </Form.Group>
          <div className="text-center d-grid">
            <Button
              variant="primary"
              size="lg"
              className="mt-3"
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmit}
            >
              Login
            </Button>
          </div>
        </Form.Floating>
      </Card>
    </Container>
  );
}
