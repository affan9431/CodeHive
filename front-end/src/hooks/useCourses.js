import { useQuery } from "@tanstack/react-query";
import { getCourses } from "../services/getCourses";


export const useCourses = () => {
  const {
    data: coursesData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  return { coursesData, error, isLoading };
};
