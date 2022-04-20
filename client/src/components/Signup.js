import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";

export default function Signup() {
  const initialState = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
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
        first_name: formValues.first_name,
        last_name: formValues.last_name,
      };

      fetch("http://localhost:3031/register", {
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
            alert("register success");
            window.location = "/login";
          } else if (data.message === "email already in use") {
            alert("Email already in use");
          } else {
            alert("register failed");
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
    if (!values.first_name) {
      errors.first_name = "First Name is required!";
    }
    if (!values.last_name) {
      errors.last_name = "Last Name is required!";
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
              <Person size={25} color="white" />
            </span>
          </div>
          <h5 className="text-center form-header">Sign Up</h5>
          <Form.Group>
            <Form.Label className="mt-3">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              defaultValue={formValues.email}
              onChange={handleChange}
            />
            <p className="text-danger">{formErrors.email}</p>
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-3">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              defaultValue={formValues.password}
              onChange={handleChange}
            />
            <p className="text-danger">{formErrors.password}</p>
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-3">First Name</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              placeholder="Enter your first name"
              defaultValue={formValues.first_name}
              onChange={handleChange}
            />
            <p className="text-danger">{formErrors.first_name}</p>
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-3">Last Name</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              placeholder="Enter your last name"
              defaultValue={formValues.last_name}
              onChange={handleChange}
            />
            <p className="text-danger">{formErrors.last_name}</p>
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
              Sign Up
            </Button>
          </div>
        </Form.Floating>
      </Card>
    </Container>
  );
}
