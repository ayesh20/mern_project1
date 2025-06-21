import Student from "../models/student.js";

export function getStudents(req, res){

	Student.find()
		.then((students) => {
			res.json(students);
		})
		.catch(() => {
			res.json({
				message: "Failed to fetch students",
			});
		});
}

export function createStudent (req, res){
	if(req.user == null){
		res.status(403).json({
			message : "please login to create student"
		})
		return
	}
	if(req.user.role != "admin"){
		res.status(403).json({
			message : "only admin can create student"
		})
		return
	}
	console.log(req.body);

	const student = new Student({
		name: req.body.name,
		age: req.body.age,
		email: req.body.email,
	});

	student
		.save()
		.then(() => {
			res.json({
				message: "Student saved successfully",
			});
		})
		.catch(() => {
			console.log("Failed to save student");
		});
}