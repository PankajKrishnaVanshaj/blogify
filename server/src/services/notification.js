import Users from "../models/user.model.js";
import cron from "node-cron";

const createNotification = async (userId, message) => {
  try {
    const user = await Users.findById(userId);
    if (user) {
      const notification = {
        message,
        date: new Date(),
        read: false,
      };
      user.notifications.push(notification);
      await user.save();
    }
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const notifyFollowers = async (authorId, blogPostId) => {
  try {
    const author = await Users.findById(authorId).populate("followers.user");
    if (author) {
      const message = blogPostId;
      for (const follower of author.followers) {
        if (follower.user._id.toString() !== authorId.toString()) {
          await createNotification(follower.user._id, message);
        }
      }
    }
  } catch (error) {
    console.error("Error notifying followers:", error);
  }
};

export const getNotificationById = async (userId, notificationId) => {
  try {
    const user = await Users.findById(userId);
    if (user) {
      const notification = user.notifications.id(notificationId);
      if (notification) {
        return notification;
      } else {
        console.error("Notification not found");
      }
    } else {
      console.error("User not found");
    }
  } catch (error) {
    console.error("Error getting notification by ID:", error);
  }
};

export const deleteNotification = async (message) => {
  try {
    const users = await Users.find({ "notifications.message": message });

    for (const user of users) {
      user.notifications = user.notifications.filter(
        (notification) => notification.message !== message
      );
      await user.save();
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
};

export const markNotificationAsRead = async (userId, notificationId) => {
  try {
    const user = await Users.findById(userId);
    if (user) {
      const notification = user.notifications.id(notificationId);
      if (notification) {
        notification.read = true;
        await user.save();
      } else {
        console.error("Notification not found");
      }
    } else {
      console.error("User not found");
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const deleteReadNotification = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMinutes(oneMonthAgo.getMinutes() - 5);

    // Find users with read notifications older than one month
    const users = await Users.find({
      "notifications.read": true,
      "notifications.date": { $lt: oneMonthAgo },
    });

    // Iterate over each user and remove the relevant notifications
    for (const user of users) {
      const initialLength = user.notifications.length;
      user.notifications = user.notifications.filter(
        (notification) =>
          !(notification.read && new Date(notification.date) < oneMonthAgo)
      );
      // Only save if notifications were removed
      if (initialLength !== user.notifications.length) {
        await user.save();
      }
    }

    console.log("Old read notifications deleted successfully.");
  } catch (error) {
    console.error("Error deleting old read notifications:", error);
  }
};

// Schedule the function to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running daily job to delete old read notifications...");
  deleteReadNotification();
});
