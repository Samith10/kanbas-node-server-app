import Database from "../Database/index.js";
​​import * as enrollmentsDao from "../Enrollments/dao.js";
export default function CourseRoutes(app) {
  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };
  app.get("/api/courses/:cid/users", findUsersForCourse);

    app.post("/api/courses", async (req, res) => {
        const course = { ...req.body,
          _id: new Date().getTime().toString() };
          const currentUser = req.session["currentUser"];
          if (currentUser) {
            await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
          }
       
        Database.courses.push(course);
        res.send(course);
      });
    
  app.get("/api/courses", (req, res) => {
    const courses = Database.courses;
    res.send(courses);
  });
  app.delete("/api/courses/:id", (req, res) => {
    const { id } = req.params;
    Database.courses = Database.courses.filter((c) => c._id !== id);
    res.sendStatus(204);
  });
  app.put("/api/courses/:id", (req, res) => {
    const { id } = req.params;
    const course = req.body;
    Database.courses = Database.courses.map((c) =>
      c._id === id ? { ...c, ...course } : c
    );
    res.sendStatus(204);
  });
}
