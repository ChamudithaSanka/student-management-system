package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Course;
import com.example.studentmanagement.repository.CourseRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@Transactional
public class CourseService {

	private final CourseRepository courseRepository;

	public CourseService(CourseRepository courseRepository) {
		this.courseRepository = courseRepository;
	}

	@Transactional(readOnly = true)
	public List<Course> getAllCourses() {
		return courseRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Course getCourseById(Long id) {
		return courseRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));
	}

	public Course createCourse(Course course) {
		if (courseRepository.existsByCourseCode(course.getCourseCode())) {
			throw new ResponseStatusException(CONFLICT, "Course code already exists");
		}
		return courseRepository.save(course);
	}

	public Course updateCourse(Long id, Course course) {
		Course existingCourse = getCourseById(id);
		if (courseRepository.existsByCourseCodeAndIdNot(course.getCourseCode(), id)) {
			throw new ResponseStatusException(CONFLICT, "Course code already exists");
		}
		existingCourse.setCourseName(course.getCourseName());
		existingCourse.setCourseCode(course.getCourseCode());
		existingCourse.setDescription(course.getDescription());
		existingCourse.setDuration(course.getDuration());
		existingCourse.setStatus(course.getStatus());
		return courseRepository.save(existingCourse);
	}

	public void deleteCourse(Long id) {
		if (!courseRepository.existsById(id)) {
			throw new ResponseStatusException(NOT_FOUND, "Course not found");
		}
		courseRepository.deleteById(id);
	}
}