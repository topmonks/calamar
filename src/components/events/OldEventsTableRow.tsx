import { IconButton, TableCell, TableRow } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import React from "react";

type Props = {
  children: any;
  expandComponent: any;
  [x: string]: any;
};

function OldEventsTableRow({
  children,
  expandComponent,
  ...otherProps
}: Props) {
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
        <TableRow style={{ backgroundColor: "#fed6d2" }}>
          <TableCell colSpan={8}>{expandComponent}</TableCell>
        </TableRow>
      )}
    </>
  );
}

export default OldEventsTableRow;
