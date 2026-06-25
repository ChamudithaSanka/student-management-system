package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Course;
import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.repository.StudentRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@Transactional
public class StudentService {

	private final StudentRepository studentRepository;
	private final CourseRepository courseRepository;

	public StudentService(StudentRepository studentRepository, CourseRepository courseRepository) {
		this.studentRepository = studentRepository;
		this.courseRepository = courseRepository;
	}

	@Transactional(readOnly = true)
	public List<Student> getAllStudents() {
		return studentRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Student getStudentById(Long id) {
		return studentRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Student not found"));
	}

	public Student createStudent(Student student) {
		if (studentRepository.existsByEmail(student.getEmail())) {
			throw new ResponseStatusException(CONFLICT, "Student email already exists");
		}
		student.setCourse(resolveCourse(student.getCourse()));
		return studentRepository.save(student);
	}

	public Student updateStudent(Long id, Student student) {
		Student existingStudent = getStudentById(id);
		if (studentRepository.existsByEmailAndIdNot(student.getEmail(), id)) {
			throw new ResponseStatusException(CONFLICT, "Student email already exists");
		}
		existingStudent.setFirstName(student.getFirstName());
		existingStudent.setLastName(student.getLastName());
		existingStudent.setEmail(student.getEmail());
		existingStudent.setPhone(student.getPhone());
		existingStudent.setDateOfBirth(student.getDateOfBirth());
		existingStudent.setCourse(resolveCourse(student.getCourse()));
		existingStudent.setStatus(student.getStatus());
		return studentRepository.save(existingStudent);
	}

	public void deleteStudent(Long id) {
		if (!studentRepository.existsById(id)) {
			throw new ResponseStatusException(NOT_FOUND, "Student not found");
		}
		studentRepository.deleteById(id);
	}

	private Course resolveCourse(Course course) {
		if (course == null || course.getId() == null) {
			return null;
		}
		return courseRepository.findById(course.getId())
				.orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));
	}
}