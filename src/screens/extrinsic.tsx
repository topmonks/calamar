import React, { useEffect } from "react";
import { getExtrinsics } from "../services/extrinsicsService";
import { Link, useParams } from "react-router-dom";
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
import EventsTable from "../components/events/EventsTable";

function ExtrinsicPage() {
  const [extrinsic, setExtrinsic] = React.useState<any>(null);
  let { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const extrinsic = await getExtrinsics(1, 0, { id: { _eq: id } });
      setExtrinsic(extrinsic[0]);
    };
    fetchData();
  }, [id]);

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
                <TableCell>Block hash</TableCell>
                <TableCell>
                  <Link to={`/block/${extrinsic.blockId}`}>
                    {extrinsic.blockHash}
                  </Link>
                </TableCell>
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
        <EventsTable filter={{ extrinsic: { id: { _eq: extrinsic.id } } }} />
      </div>
    );
  }

  return null;
}

export default ExtrinsicPage;
