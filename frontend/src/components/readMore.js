import React, { useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

export default function ForumPost() {
    const [forumPost, setForumPost] = useState(null);

    const navigate = useNavigate();
    const id = useParams().id 
    console.log(id)

    useEffect(() => {
        axios.post("http://localhost:5000/findOne", { id: id})
            .then(response => {
                if (response.data.item) {
                    setForumPost(response.data.item);
                }
            })
            .catch(error => {
                console.error("Error fetching forum post:", error);
            });
    }, [id, navigate]);

    if (!forumPost) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            

            <Container>
                <Row className="mt-4">
                    <Col>
                        <Card>
                            <Card.Body>
                            <iframe src={forumPost.image} width="100%" height="450"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                                <Card.Title>{forumPost.title}</Card.Title>
                               
                                <Card.Text>{forumPost.subject}</Card.Text>
                                <Card.Text>{forumPost.content}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* <Footer /> */}
        </div>
    );
}
