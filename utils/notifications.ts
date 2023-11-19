import { notification } from "antd-notifications-messages";

export const showNotification = (render: () => JSX.Element) => {
  notification({
    position: "bottomLeft",
    render,
  });
};
