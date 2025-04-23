import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getLogin } from "../services/getLogin";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => getLogin({ email, password }),
    onSuccess: (user) => {
      localStorage.setItem("token", user.token);
      toast.success("Login successful!");
      navigate("/", { replace: true });
    },
    onError: (err) => {
      console.log(err);
      toast.error("Provided email or password are incoorect");
    },
  });

  return { login, isLoading };
}
