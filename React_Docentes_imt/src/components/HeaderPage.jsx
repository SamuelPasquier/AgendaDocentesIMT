import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

export function HeaderPage({ header1, paragraph }) {
    return (
        <header className="bg-dark text-white py-3">
            <Container fluid>
                <Row className="d-flex justify-content-between align-items-center">
                    <Col>
                        <img
                            src="https://i.imgur.com/z4gMSNl.png"
                            alt="Logo"
                            style={{ height: "180px" }}
                        />
                    </Col>
                    <Col>
                        <center>
                            <h1>{header1}</h1>
                            <p>{paragraph}</p>
                        </center>
                    </Col>
                </Row>
            </Container>
        </header>
    );
}

HeaderPage.propTypes = {
    header1: PropTypes.string.isRequired,
    paragraph: PropTypes.string.isRequired,
};