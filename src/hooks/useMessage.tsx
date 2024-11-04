import { useDispatch } from "react-redux";
import { setMessage } from "../store/features/message/messageSlice";

interface MessageOptions {
  autoHideDuration?: number;
  severity?: "success" | "info" | "error" | "warning";
  vertical?: "top" | "bottom";
  horizontal?: "left" | "center" | "right";
  title?: string;
  text?: string;
  open?: boolean;
}

const useMessage = () => {
  const dispatch = useDispatch();

  const showMessage = (options: MessageOptions) => {
    if (!options.autoHideDuration) {
      options.autoHideDuration = 3000;
    }
    if (!options.severity) {
      // success | info | error | warning
      options.severity = "success";
    }
    if (!options.vertical) {
      options.vertical = "top";
    }
    if (!options.horizontal) {
      options.horizontal = "center";
    }
    if (!options.title) {
      options.title = "Зверніть увагу!";
    }
    options.open = true;
    dispatch(setMessage(options));
  };
  return showMessage;
};

export default useMessage;
