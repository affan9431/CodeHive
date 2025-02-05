import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export default function BasicModal({ children, courseId, userId }) {
  const [open, setOpen] = React.useState(false);
  const [answer, setAnswer] = React.useState("");
  const [isSave, setIsSave] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      setIsSave(true);
      await axios.post(
        // `http://localhost:8080/api/questions/${courseId}/answers`,
        `${import.meta.env.BACKEND_URL}/api/questions/${courseId}/answers`,
        {
          content: answer,
          userId: userId,
        }
      );

      toast.success("Your answer has been added successfully.");
      setIsSave(false);
    } catch (err) {
      console.log(err);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>{children}</Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box sx={style}>
          <TextField
            label="Your Answer"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#7E22CE",
              "&:hover": { backgroundColor: "#6B21A8" },
            }}
            onClick={handleSubmit}
          >
            {isSave ? "Saving..." : "Add Your Answer"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
