import { Typography, IconButton } from "@mui/material";
import { TaskAlt, AddCircle } from "@mui/icons-material";

const PageLink = ({ text, icon, count }) => {
  return (
    <div className="pageLink">
      <div className="text">
        <div className="top">
          <Typography sx={{ color: "#333", fontSize: "smaller" }}>
            {text}
          </Typography>
          {icon && (
            <IconButton>
              <AddCircle sx={{ color: "#333", fontSize: 20 }} />
            </IconButton>
          )}
        </div>
        <Typography sx={{ fontWeight: "bold", fontSize: "2em" }}>
          {count}
        </Typography>
      </div>
      <div className="icon">{icon}</div>
    </div>
  );
};

export default PageLink;
