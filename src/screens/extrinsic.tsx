import React, { useEffect } from "react";
import { getExtrinsics } from "../services/extrinsicsService";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";
import {
  convertTimestampToTimeFromNow,
  formatDate,
} from "../utils/convertTimestampToTimeFromNow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { getEvents } from "../services/eventsService";
import ExtrinsicEventsTable from "../components/extrinsics/ExtrinsicEventsTable";

function ExtrinsicPage() {
  const [extrinsic, setExtrinsic] = React.useState<any>(null);
  let { hash } = useParams();
  const [events, setEvents] = React.useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const extrinsic = await getExtrinsics(1, 0, { hash });
      setExtrinsic(extrinsic[0]);
    };
    fetchData();
  }, [hash]);

  useEffect(() => {
    const getEventsAndSetState = async () => {
      if (hash) {
        const events = await getEvents(100, 0, { extrinsic: { hash } });
        setEvents(events);
      }
    };
    getEventsAndSetState();
  }, [setEvents]);

  if (extrinsic) {
    return (
      <div>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>{extrinsic.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hash</TableCell>
                <TableCell>{extrinsic.hash}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Section</TableCell>
                <TableCell>{extrinsic.section}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Method</TableCell>
                <TableCell>{extrinsic.method}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Is signed</TableCell>
                <TableCell>
                  {extrinsic.isSigned ? <CheckCircleIcon /> : <CancelIcon />}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account</TableCell>
                <TableCell>{extrinsic.signer}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>
                  <Tooltip
                    placement="top"
                    title={formatDate(extrinsic.created_at)}
                  >
                    <span>
                      {convertTimestampToTimeFromNow(extrinsic.created_at)}
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <ExtrinsicEventsTable events={events} />
      </div>
    );
  }

  return null;
}

export default ExtrinsicPage;
