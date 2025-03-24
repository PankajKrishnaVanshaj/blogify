import Users from "../models/user.model.js";
import cron from "node-cron";

// Function to create a notification for a user
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

      // console.log(`Notification successfully created for user ${userId}`);
    } else {
      console.error(`User with ID ${userId} not found`);
    }
  } catch (error) {
    console.error("Error creating notification:", error.message);
  }
};

// Function to notify all followers of an author when a blog post is created
export const notifyFollowers = async (authorId, blogPostId) => {
  try {
    const author = await Users.findById(authorId).populate("followers.user");

    if (author) {
      // console.log(`Author found: ${author.username}, notifying followers...`);
      const message = `${blogPostId}`;

      // Notify each follower
      for (const follower of author.followers) {
        if (
          follower?.user?._id &&
          follower.user._id.toString() !== authorId.toString()
        ) {
          // console.log(`Notifying follower with ID: ${follower.user._id}`);
          await createNotification(follower.user._id, message);
        } else {
          console.error("Follower user data is invalid:", follower);
        }
      }
    } else {
      console.error(`Author with ID ${authorId} not found`);
    }
  } catch (error) {
    console.error("Error notifying followers:", error.message);
  }
};

// Function to retrieve a notification by its ID
export const getNotificationById = async (userId, notificationId) => {
  try {
    const user = await Users.findById(userId);
    if (user) {
      const notification = user.notifications.id(notificationId);
      return notification || console.error("Notification not found");
    } else {
      console.error("User not found");
    }
  } catch (error) {
    console.error("Error getting notification by ID:", error.message);
  }
};

// Function to delete notifications by message
export const deleteNotification = async (message) => {
  try {
    const users = await Users.find({ "notifications.message": message });
    for (const user of users) {
      const initialLength = user.notifications.length;
      user.notifications = user.notifications.filter(
        (notification) => notification.message !== message
      );
      if (initialLength !== user.notifications.length) {
        await user.save();
      }
    }
  } catch (error) {
    console.error("Error deleting notifications:", error.message);
  }
};

// Function to mark a notification as read
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
    console.error("Error marking notification as read:", error.message);
  }
};

// Function to delete notifications that are read and older than one month
export const deleteReadNotification = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Fix: subtract one month

    const users = await Users.find({
      "notifications.read": true,
      "notifications.date": { $lt: oneMonthAgo },
    });

    for (const user of users) {
      const initialLength = user.notifications.length;
      user.notifications = user.notifications.filter(
        (notification) =>
          !(notification.read && new Date(notification.date) < oneMonthAgo)
      );

      if (initialLength !== user.notifications.length) {
        await user.save();
      }
    }

    console.log("Old read notifications deleted successfully.");
  } catch (error) {
    console.error("Error deleting old read notifications:", error.message);
  }
};

// Schedule the function to run daily at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running daily job to delete old read notifications...");
  deleteReadNotification();
});
