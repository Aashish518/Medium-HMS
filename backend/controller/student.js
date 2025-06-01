const Student = require("../schema/students");

exports.addstudents = async (req, res) => {
    try {
        const studentData = req.body;
        const files = req.files;
        studentData.cast_certificate = files.cast_certificate?.[0]?.path;
        studentData.marksheet = files.marksheet?.[0]?.path;
        studentData.admission_document = files.admission_document?.[0]?.path;
        studentData.student_adhar_card = files.student_adhar_card?.[0]?.path;

        const newStudent = new Student(studentData);
        await newStudent.save();

        res.status(201).json({
            message: "Student added successfully",
            student: newStudent,
        });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: "Failed to add student" });
    }
};

exports.getstudents = async(req,res) => {
    try {
        const students = await Student.find();
        res.status(200).json({students})
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: "Failed to get student" });
    }
}

exports.updatestudents = async(req,res) => {
    try {
        const { ids } = req.body;
        console.log("Received IDs:", ids);

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "No student IDs provided" });
        }

        const result = await Student.updateMany(
            { _id: { $in: ids } },
            { $set: { merit_status: "in_merit" } }
        );

        console.log("Update result:", result);

        res.status(200).json({ message: "Students merit status updated successfully", result });
    } catch (error) {
        console.error("Error updating merit status:", error);
        res.status(500).json({ error: "Failed to update merit status" });
    }
}