import { toast } from "react-toastify";

export const showToastInfo = (msg, type = "info") => {
  if (type === "info") {
    toast.info(msg, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } else if (type === "warn") {
    toast.warn(msg, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } else if (type === "error") {
    toast.error(msg, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  }
};
