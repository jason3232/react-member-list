import { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Alert, Card, 
  Badge, CloseButton, ToggleButton, ToggleButtonGroup, Form
} from 'react-bootstrap';

function App() {
  // initial data fetched from api
  const [apiData, setApiData] = useState([]);
  // filtered member data
  const [memberData, setMemberData] = useState([]);
  // list of activity to display on filter
  const [filterActitivty, setFilterActitivty] = useState([]);
  // string to filter member names with
  const [filterName, setFilterName] = useState('');
  // map for count of members for each actitivty
  const [activityCount, setActivityCount] = useState(new Map());

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // fetch member data
  useEffect(() => {
    fetch('sampleData.json')
      .then((res) => res.json())
      .then(
        (json) => {
          setApiData(json.members);
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );
  }, []);

  // set activity count and member on api updates
  useEffect(() => {
    setActivityCount(countActivity(apiData));
    setMemberData(apiData);
  }, [apiData]);

  // update filtered member data on api or filter updates
  useEffect(() => {
    if (filterActitivty.length) {
      // only display filtered activities
      setMemberData(
        apiData.filter((member) => {
          return (
            filterActitivty.some(
              (activity) => member.lastActivities.includes(activity))
            && member.name.includes(filterName)
          )
        }
      ));
    } else {
      // reset to initial data
      setMemberData(apiData);
    }
  }, [apiData, filterActitivty, filterName]);

  // count activity occurrences and return a map
  const countActivity = (data) => {
    const map = new Map();
    data.forEach(member => {
      member.lastActivities.forEach((activity) => {
        if (map.has(activity)) {
          map.set(activity, map.get(activity) + 1);
        } else {
          map.set(activity, 1);
        }
      })
    });
    return map;
  }

  // assign a random value to simulate the rating recalculation
  const recalculateRating = (members) => {
    return members.map(member => {
      return {...member, rating: Math.floor(Math.random() * 5 + 1)}
    });
  }

  // update the api data on removing member
  const onRemoveCard = (e) => {
    e.preventDefault();
    const newMembers = memberData.filter((member) => member.id !== parseInt(e.target.value));
    // simulate a rating recalculation on member list update
    setApiData(recalculateRating(newMembers));
  }

  if (error) {
    return (
      <Alert variant='danger'>
        <p>{error}</p>
      </Alert>
    );
  } else if (!isLoaded) {
    return (
      <Container fluid>
        <Row>
          <Col>
            <p className='text-center'>Loading...</p>
          </Col>
        </Row>
      </Container>
    )
  } else {
    return (
      <Container className="p-5">
        <Row className="mb-3">
          <Form.Group>
            <Form.Label>Filter by Member Name</Form.Label>
            <Form.Control type="text" placeholder="e.g. Alice" onChange={(e) => setFilterName(e.target.value)}></Form.Control>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <ToggleButtonGroup type="checkbox" defaultValue={[]} onChange={(value) => setFilterActitivty(value)}>
            {[...activityCount].map((kv, i) => (
              <ToggleButton variant="primary" key={i} id={`activity-${kv[0]}`} value={kv[0]}>
                {kv[0]} <Badge bg="secondary">{kv[1]}</Badge>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Row>
        <Row xs={1} md={2} lg={3} className='g-3'>
          {memberData
              .map((member) => (
                <Col key={member.id}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <CloseButton className="float-end" value={member.id} onClick={onRemoveCard}/>
                        {member.name}
                      </Card.Title>
                      <p className="text-muted">Age: {member.age}</p>
                      <p>Rating: {[...Array(member.rating)].map((_, i) => <span key={i}>⭐</span>)}</p>
                      <div>
                        {member.lastActivities
                          .map((activity, i) => (
                            <Badge bg='primary' className="mx-1" key={i}>{activity}</Badge>
                          ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
        </Row>
      </Container>
    )
  }
}

export default App;
