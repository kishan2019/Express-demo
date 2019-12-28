const Joi = require('joi');
const expresss = require('express');
const app = expresss();

app.use(expresss.json());

//middle ware 
app.use(function(req, res, next){
    console.log("Logging...");
    next();
})
app.use(function(req, res, next){
    console.log("Authentication...");
    next();
})

const courses = [{id: 1, name: "course1" },
    {id: 2, name: "course2" },
    {id: 3, name: "course3" }
];

//SET Rought
app.get('/', (req,res) => {
    res.send("Hello kishan is here");
})

// get method
app.get('/student', (req,res) => {
    res.send(courses);
})

// get methode using id
app.get('/student/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)  return res.status(404).send("id in not found");
    res.send(course);
 })

//post method with Joi
app.post('/student', (req,res) => {
    const { error } = validateCourse(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

//put method
app.put('/student/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    const {error} = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    course.name = req.body.name;
    res.send(courses);
});

function validateCourse(course){
    const Schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, Schema);
}

//Delete methode
app.delete('/student/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send("id in not found");

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})


const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Listening on port ${port}...`));