const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
  { id: 4, name: "course4" },
];

app.get("/", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  //if invalid, return 400 - bad request
  if (error) {
    //Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //Look up course
  //If not existing, return 404 Resource Not found
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    //404 Resource Not Found
    res.status(404).send("The course with the given ID was not found");
  }
  //Validate
  const { error } = validateCourse(req.body);
  //if invalid, return 400 - bad request
  if (error) {
    //Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  //Update course
  course.name = req.body.name;
  //Return the updated course
  res.send(course);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    //404 Resource Not Found
    res.status(404).send("The course with the given ID was not found");
  }
  res.status(200).send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}....`));
