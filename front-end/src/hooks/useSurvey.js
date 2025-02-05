import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSurvey as survey } from "../services/createSurvey";

export const useSurvey = () => {
  const queryClient = useQueryClient();
  const { mutate: createSurvey, isLoading } = useMutation({
    mutationFn: ({ userId, experience, content, students }) =>
      survey({ userId, experience, content, students }),
    onSuccess: (survey, variables) => {
      const { userId } = variables;
      queryClient.setQueryData(["survey", userId], survey);
    },
    onError: () => {
      console.log("Something went wrong");
    },
  });

  return { createSurvey, isLoading };
};
