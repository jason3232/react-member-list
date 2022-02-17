import {
  Col,
  Card,
  Badge,
  CloseButton,
} from "react-bootstrap";

const MemberCard = ({member, onRemoveCard}) => {
  return (
    <Col key={member.id}>
      <Card>
        <Card.Body>
          <Card.Title>
            <CloseButton
              className="float-end"
              value={member.id}
              onClick={onRemoveCard}
            />
            {member.name}
          </Card.Title>
          <p className="text-muted">Age: {member.age}</p>
          <p>
            Rating:{" "}
            {[...Array(member.rating)].map((_, i) => (
              <span key={i}>⭐</span>
            ))}
          </p>
          <div>
            {member.lastActivities.map((activity, i) => (
              <Badge bg="primary" className="mx-1" key={i}>
                {activity}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default MemberCard;