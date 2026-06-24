import { useNotification } from "@/contexts/NotificationContext";

export const useToast = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  return {
    success: (title: string, message?: string) => {
      showSuccess(title, message);
    },

    error: (title: string, message?: string) => {
      showError(title, message);
    },

    warning: (title: string, message?: string) => {
      showWarning(title, message);
    },

    info: (title: string, message?: string) => {
      showInfo(title, message);
    },
  };
};
