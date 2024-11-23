import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

let currentUser = null; // Keeps track of the logged-in user

export default function UserRoutes(app) {
  const createUser = (req, res) => {
    const newUser = dao.createUser(req.body);
    res.status(201).json(newUser);
  };

  const deleteUser = (req, res) => {
    const userId = Number(req.params.userId);
    const deletedUser = dao.deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(deletedUser);
  };

  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.status(200).json(users);
  };

  const findUserById = (req, res) => {
    const userId = Number(req.params.userId);
    const user = dao.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  };

  const updateUser = (req, res) => {
    const userId = Number(req.params.userId);
    const userUpdates = req.body;

    // Update the user
    const updatedUser = dao.updateUser(userId, userUpdates);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update currentUser if it matches the updated user
    if (currentUser?._id === userId) {
      currentUser = updatedUser;
    }

    res.status(200).json(updatedUser);
  };

  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);

    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }

    // Destroy the current session (if any) before proceeding
    req.session.destroy((err) => {
      if (err) {
        console.error("Error clearing session during signup:", err);
      }
    });

    // Create the new user
    const newUser = dao.createUser(req.body);

    // Do not set the session; redirect to Sign In for login
    res.status(201).json({ message: "Signup successful. Please log in." });
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    const user = dao.findUserByCredentials(username, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Set currentUser for session
    currentUser = user;
    req.session.currentUser = user; // Store in session for persistence
    res.status(200).json(user);
  };

  const signout = (req, res) => {
    currentUser = null;
    res.sendStatus(200);
  };


  const profile = async (req, res) => {
    res.json(currentUser);
  };


  // New createCourse route
  const createCourse = (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Create the course
    const newCourse = courseDao.createCourse(req.body);

    // Enroll the current user in the course (as the creator)
    const enrollment = enrollmentsDao.enrollUserInCourse(
      currentUser._id,
      newCourse._id
    );

    if (!enrollment) {
      return res
        .status(400)
        .json({ error: "User is already enrolled in this course" });
    }

    // Respond with the created course
    res.status(201).json(newCourse);
  };

  app.get("/api/users/profile", profile);

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.get("/api/users/profile", profile);
  app.post("/api/users/current/courses", createCourse);
}
