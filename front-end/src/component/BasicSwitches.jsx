import * as React from "react";
import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Switch demo" } };

export default function BasicSwitches() {
  return (
    <div>
      <Switch
        {...label}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "black",
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "black",
          },
        }}
      />
    </div>
  );
}
