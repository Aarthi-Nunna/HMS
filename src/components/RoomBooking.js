import { useState } from "react";
import { Card, Container, Col, Row } from "react-bootstrap";
import RoomBookingService from "../services/RoomBooking";
import history from "../history";
import { useLocation } from "react-router-dom";

const RoomForm = (props) => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(false);
  const [roomType, setRoomType] = useState("single");
  const [floorNumber, setFloorNumber] = useState("1");
  const [warning, setWarning] = useState(false);

  const location = useLocation();

  const bookRoom = (id) => {
    const userid = location.state.userID ;
    RoomBookingService.bookRooms(id, userid)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        if (data != undefined && data["success"] == true) {
          alert("Successful booking");
        } else {
          alert("Invalid booking");
        }
      });
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    RoomBookingService.getRooms(roomType, floorNumber)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);

        if (data != undefined && data["numRooms"] > 0) {
          setStatus(true);
          setWarning(false);
          let content = data["rooms"];
          setData(content);
        } else {
          setStatus(false);
          setWarning(true);
          setData("No Rooms available");
        }
      });
  };

  return (
    <div style={{ width: "40rem", height: "100rem", margin: "auto" }}>
      <div id="alert" className="alert">
        {alert}
      </div>
      <Card className="bg-dark text-white">
        <h1>Room Booking</h1>
        <Card.Body className="bg-dark text-white">
          <form onSubmit={handleSubmit} id="roomform">
            <label className="p-1 m-2">
              {" "}
              <p style={{ fontSize: "20px", display: "inline-flex" }}>
                Room Type *{" "}
              </p>
              <select
                id="roomtype"
                name="roomtypes"
                form="roomform"
                onChange={(e) => setRoomType(e.target.value)}
                required
              >
                <option value="single">Single Room</option>
                <option value="shared">Shared Room</option>
              </select>
            </label>
            <br />
            <label className="p-1 m-2">
              {" "}
              <p style={{ fontSize: "20px", display: "inline-flex" }}>
                Floor Number *
              </p>
              <select
                id="floornumber"
                name="floornumbers"
                form="roomform"
                onChange={(e) => setFloorNumber(e.target.value)}
                required
              >
                <option value="1">First Floor</option>
                <option value="2">Second Floor</option>
              </select>
            </label>
            <br />
            <button type="submit" className="btn btn-info p-1 m-4">
              Submit
            </button>
          </form>
        </Card.Body>
      </Card>
      {status && (
        <Container className="bg-dark text-white">
          <Row>
            {data.map((element) => {
              return (
                <Col className="p-4 m-1 w-25 h-auto">
                  <Card style={{border: "1px solid white"}}className="bg-dark text-white">
                    <Card.Body className="bg-dark">
                      RoomNumber : {element.roomNum}
                      <br />
                      Hostel: {element.hostel}
                      <br />
                      <button onClick={() => bookRoom(element._id)}>
                        Book Room
                      </button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      )}
      {warning && data}
    </div>
  );
};

export default RoomForm;
