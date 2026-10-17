import { useEffect } from "react";
import useNotificationStore from "../../store/useNotificationStore";
import { motion, AnimatePresence } from "motion/react";
import "../../sass/Notification.scss";

function Notification() {
  const notification = useNotificationStore((state) => state.notification);
  const hideNotification = useNotificationStore((state) => state.hideNotification);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`notification-container ${notification.type === "success" ? "success" : "error"}`}
          onClick={hideNotification}
        >
          {notification.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Notification;
