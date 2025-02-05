import { Construction } from "lucide-react";
import { Alert, AlertTitle } from "@mui/material";
import { Box, Typography } from "@mui/material";

export default function LearningToolsSection({ courseId }) {
  return (
    <Box className="max-w-4xl mx-auto p-6">
      <Alert
        severity="info"
        icon={<Construction className="h-5 w-5 text-purple-600" />}
      >
        <AlertTitle className="text-lg font-semibold text-purple-800 mb-2">
          Coming Soon!
        </AlertTitle>
        <Typography className="text-purple-700">
          We're working on exciting learning tools to enhance your course
          experience. These will include:
        </Typography>
        <ul className="mt-4 space-y-2 list-disc pl-6">
          <li>Interactive practice exercises</li>
          <li>Downloadable resources</li>
          <li>Study guides and summaries</li>
          <li>Progress tracking tools</li>
        </ul>
      </Alert>
    </Box>
  );
}
