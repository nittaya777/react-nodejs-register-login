import React, { useEffect } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import GalleryData from "../data/GalleryData";

export const Gallery = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3031/authen", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
        } else {
          localStorage.removeItem("token");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, []);

  return (
    <Container className="mt-5 mb-5">
      <h1>Gallery</h1>
      <Row xs={1} md={3} className="g-4">
        {GalleryData.map((item, index) => {
          return (
            <Col key={index}>
              <Card>
                <Card.Img variant="top" src={item.image} alt={item.alt} />
                <Card.Body>
                  {" "}
                  <Card.Title>{item.title}</Card.Title>
                  {item.description}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};
