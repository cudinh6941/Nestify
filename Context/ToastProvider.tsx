import React, { createContext, useState, useContext, ReactNode } from "react";
import Toast from "@/components/Toast";
import { ToastType } from "@/constants/common";
import { runOnJS } from "react-native-reanimated";

interface ToastContextProps {
  show: (message: string, type?: ToastType, duration?: number) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextProps>({
  show: () => {},
  hide: () => {},
});

export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
}): React.ReactElement => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");
  const [duration, setDuration] = useState(3000);

  const show = (
    msg: string,
    toastType: ToastType = "info",
    toastDuration: number = 3000
  ) => {
    if (visible) {
      // Nếu đang hiển thị toast, ẩn trước khi hiển thị cái mới
      runOnJS(hide)();
      // Đặt timeout để đảm bảo animation hoàn thành trước khi hiển thị toast mới
      setTimeout(() => {
        setMessage(msg);
        setType(toastType);
        setDuration(toastDuration);
        setVisible(true);
      }, 300);
    } else {
      setMessage(msg);
      setType(toastType);
      setDuration(toastDuration);
      setVisible(true);
    }
  };

  const hide = () => {
    setVisible(false);
  };

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      <Toast
        type={type}
        message={message}
        duration={duration}
        onClose={hide}
        visible={visible}
      />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
