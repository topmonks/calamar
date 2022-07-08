import { IconButton, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import ClipboardJS from "clipboard";

const CopyToClipboardButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = React.useState(false);
  useEffect(() => {
    const clipboard = new ClipboardJS(".copy-btn");
    clipboard.on("success", (ev) => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
      ev.clearSelection();
    });
    return () => clipboard.destroy();
  }, []);

  return (
    <>
      <Tooltip
        arrow
        disableHoverListener
        open={copied}
        placement="top"
        title="Copied"
      >
        <IconButton className="copy-btn" data-clipboard-text={value}>
          <svg
            height="24"
            style={{ color: "#14A1C0" }}
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6v-6h-18v18h6v6h18v-18h-6zm-12 10h-4v-14h14v4h-10v10zm16 6h-14v-14h14v14z"
              fill="currentColor"
            />
          </svg>
        </IconButton>
      </Tooltip>
    </>
  );
};
export default CopyToClipboardButton;
