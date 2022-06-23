import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { useEffect } from "react";
import { extrinsicsState } from "../../state/extrinsics";
import { useRecoilState } from "recoil";
import { shortenHash } from "../../utils/shortenHash";
import {
  convertTimestampToTimeFromNow,
  formatDate,
} from "../../utils/convertTimestampToTimeFromNow";
import { useNavigate } from "react-router-dom";
import { getExtrinsics } from "../../services/extrinsicsService";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

type Page = {
  limit: number;
  offset: number;
};

function ExtrinsicsMiniTable() {
  const [extrinsics, setExtrinsics] = useRecoilState(extrinsicsState);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [pagination, setPagination] = React.useState({
    limit: 10,
    offset: 0,
  } as Page);

  useEffect(() => {
    const getExtrinsicsAndSetState = async (limit: number, offset: number) => {
      const extrinsics = await getExtrinsics(limit, offset, {});
      setExtrinsics(extrinsics);
    };
    getExtrinsicsAndSetState(pagination.limit, pagination.offset);
    const interval = setInterval(async () => {
      await getExtrinsicsAndSetState(pagination.limit, pagination.offset);
    }, 10000);
    return () => clearInterval(interval);
  }, [pagination.offset, pagination.limit, pagination, setExtrinsics]);

  function getPreviousPage() {
    if (pagination.offset === 0) {
      return;
    }
    setPagination({
      ...pagination,
      offset: pagination.offset - pagination.limit,
    });
  }

  function getNextPage() {
    setPagination({
      ...pagination,
      offset: pagination.offset + pagination.limit,
    });
  }

  return (
    <TableContainer
      component={Paper}
      style={{ width: "fit-content", margin: "auto" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={5}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <h3 style={{ float: "left" }}>Extrinsics</h3>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={() => navigate("/extrinsics")}
                    style={{
                      float: "right",
                      marginTop: "8px",
                    }}
                  >
                    View all
                  </Button>
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Section</TableCell>
            <TableCell>Method</TableCell>
            <TableCell>Signer</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {extrinsics.map((extrinsic: any) => (
            <TableRow key={extrinsic.id}>
              <TableCell>{extrinsic.id}</TableCell>
              <TableCell>{extrinsic.section}</TableCell>
              <TableCell>{extrinsic.method}</TableCell>
              <TableCell>{shortenHash(extrinsic.signer)}</TableCell>
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
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
              <>
                <IconButton
                  disabled={pagination.offset === 0}
                  onClick={() => getPreviousPage()}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton onClick={() => getNextPage()}>
                  <ChevronRight />
                </IconButton>
              </>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default ExtrinsicsMiniTable;
