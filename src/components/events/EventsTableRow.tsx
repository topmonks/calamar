import { IconButton, TableCell, TableRow } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import React from "react";

type Props = {
  children: any;
  expandComponent: any;
  [x: string]: any;
};

function EventsTableRow({ children, expandComponent, ...otherProps }: Props) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <TableRow {...otherProps}>
        <TableCell padding="checkbox">
          <IconButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        {children}
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7}>{expandComponent}</TableCell>
        </TableRow>
      )}
    </>
  );
}

export default EventsTableRow;
