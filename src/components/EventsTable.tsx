import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { eventsState } from "../state/events";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getEvents } from "../services/eventsService";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

const HeaderTableRow = styled(TableRow)`
  th {
    font-weight: bold !important;
  }
`;

function EventsTable() {
  const [events, setEvents] = useRecoilState(eventsState);
  const [checked, setChecked] = React.useState(true);
  const navigate = useNavigate();

  const getEventsAndSetState = async (onlySigned: boolean) => {
    const events = await getEvents(10, 0, onlySigned);
    setEvents(events);
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    await getEventsAndSetState(event.target.checked);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await getEventsAndSetState(checked);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Events</h3>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              inputProps={{ "aria-label": "controlled" }}
              onChange={handleChange}
            />
          }
          label="Only signed"
        />
      </FormGroup>
      <TableContainer component={Paper}>
        <Table aria-label="simple table" sx={{ minWidth: 650 }}>
          <TableHead>
            <HeaderTableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Section</TableCell>
              <TableCell align="right">Method</TableCell>
              <TableCell align="right">Is signed</TableCell>
              <TableCell align="right">Signer</TableCell>
              <TableCell />
            </HeaderTableRow>
          </TableHead>
          <TableBody>
            {events.map((event: any) => (
              <TableRow
                key={event.id}
                onClick={() => {
                  navigate("/events/" + event.id);
                }}
                style={{ cursor: "pointer" }}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>{event.id}</TableCell>
                <TableCell align="right">{event.section}</TableCell>
                <TableCell align="right">{event.method}</TableCell>
                <TableCell align="right">
                  {event.extrinsic.isSigned ? (
                    <CheckCircleIcon />
                  ) : (
                    <CancelIcon />
                  )}
                </TableCell>
                <TableCell align="right">{event.extrinsic.signer}</TableCell>
                <TableCell align="right">
                  <KeyboardArrowRight />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default EventsTable;
