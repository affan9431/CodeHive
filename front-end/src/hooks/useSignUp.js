import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getSignUp } from "../services/getSignUp";
import toast from "react-hot-toast";

export const useSignUp = () => {
  const navigate = useNavigate();
  const { mutate: signUp, isLoading } = useMutation({
    mutationFn: ({ userName, email, password }) =>
      getSignUp({ userName, email, password }),
    onSuccess: () => {
      toast.success("Sign Up Successful!");
      navigate("/login");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  return { signUp, isLoading };
};
