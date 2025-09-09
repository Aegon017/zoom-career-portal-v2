$(document).ready(function () {
	$("#add_new_course").click(function () {
		$("#AddCourseModal").modal("show");
	});
	$("#add_course_form").validate({
		rules: {
			course_name: {
				required: true,
			},
		},
		messages: {
			course_name: {
				required: "Course Name is required.",
			},
		},
		onkeyup: false,
		submitHandler: function (form) {
			var course_name = $("#course_name").val();
			var sub_course_of = $("#sub_course_of").val();

			$.post(
				APP_URL + "login/addNewCourse",
				{
					course_name: course_name,
					sub_course_of: sub_course_of,
				},
				function (response) {
					$("#error_course").empty();
					console.log(response);
					if (response.status == 200) {
						$("#error_course").text(response.message);
						$("input").empty();
						location.reload();
					} else {
						$("#error_course").text(response.message);
					}
				},
				"json",
			);
		},
	});

	$("body").on("click", ".btn-document-new-modals", function () {
		var Student_id = $(this).closest("tr").find("td:eq(1)").text();
		$(".btn-document-new-modals").data("id");

		$.post(
			"get_seeker_details",
			{
				Student_id: Student_id,
			},

			function (response) {
				if (response.status == 200) {
					var obj = response.users_data;
					//trHTML = response.details[0].document_name;
					$("#viewModal").modal("show");
					var content = "";

					content +=
						"<tr><td>UserId</td> <td>" +
						obj[0]["userId"] +
						"</td></tr>\n\
                                    <tr><td>Full Name</td> <td>" +
						obj[0]["name"] +
						"</td></tr>\n\
                                    <tr><td>Contact No.</td>  <td>" +
						obj[0]["mobile"] +
						"</td></tr>\n\
                                    <tr><td>Age</td> <td>" +
						obj[0]["age"] +
						" </td></tr>\n\
                                    <tr><td>Email</td> <td>" +
						obj[0]["email"] +
						" </td></tr>\n\
                                    <tr><td>Address</td>  <td>" +
						obj[0]["address"] +
						"</td></tr>\n\
                                    <tr><td>Current Location</td>  <td>" +
						obj[0]["curr_location"] +
						"</td></tr>\n\
                                    <tr><td>Qualification</td>  <td>" +
						obj[0]["degree"] +
						"</td></tr>\n\
                                    <tr><td>Skils</td>  <td>" +
						obj[0]["skills"] +
						"</td></tr>\n\
                                    <tr><td>Certified Courses</td>  <td>" +
						obj[0]["c_courses"] +
						"</td></tr>\n\
                                    <tr><td>Undergone Training</td>  <td>" +
						obj[0]["t_courses"] +
						"</td></tr>\n\
                                    <tr><td>Experience</td>  <td>" +
						obj[0]["experience"] +
						"</td></tr>\n\
                                    <tr><td>Company Name</td>  <td>" +
						obj[0]["company_name"] +
						"</td></tr>\n\
                                    <tr><td>Job Title</td><td>" +
						obj[0]["job_title"] +
						"</td></tr>\n\
                                    <tr><td>No. of years working</td>  <td>" +
						obj[0]["years_in_curr_job"] +
						"</td></tr>\n\
                                    <tr><td>Present Salary</td>  <td>" +
						obj[0]["pres_salary"] +
						"</td></tr>\n\
                                    <tr><td>Expected Salary</td>  <td>" +
						obj[0]["expec_salary"] +
						"</td></tr>\n\
                                    <tr><td>Job Status</td>  <td>" +
						obj[0]["Job_status"] +
						"</td></tr>\n\\n\
                                    <tr><td>Job Status</td>  <td>" +
						obj[0]["new_company_name"] +
						"</td></tr>\n\
                                    <tr><td>Status</td>  <td>" +
						obj[0]["status"] +
						"</td></tr>";
					$("#student-detail tbody").html(content);
				} else if (response.status == 201) {
					$("#viewModal").modal("show");
					$("#student-detail tbody").text("Currently no data.");
					//$('#msg').text('Database Error !').css({"color": "#228B22", "font-weight": "bold"});
				} else {
					$("#viewModal").modal("show");
					$("#student-detail tbody").text("Bad server response");
				}
			},
			"json",
		);
	});

	$("body").on("click", ".btn-update-modals", function () {
		var email = $(this).closest("tr").find("td:eq(4)").text();
		$.post(
			"../jobseeker/get_jobseeker_info",
			{ email: email },
			function (response) {
				$("#error_msg").empty();
				if (response.status == 1000) {
					$("#edit_userid").val(response.data.userId);
					$("#edit_name").val(response.data.name);
					$("#edit_contact").val(response.data.mobile);
					$("#edit_age").val(response.data.age);
					$("#edit_email").val(response.data.email);
					$("#edit_qualification").val(response.data.degree);
					$("#edit_address").val(response.data.address);
					$("#edit_curre_locat").val(response.data.curr_location);
					$("#edit_certify_course").val(response.data.c_courses);
					$("#edit_training_course").val(response.data.t_courses);
					$("#edit_exp").val(response.data.experience);
					$("#edit_company").val(response.data.company_name);
					$("#edit_title").val(response.data.job_title);
					$("#edit_years_exp").val(response.data.years_in_curr_job);
					$("#edit_present_sal").val(response.data.pres_salary);
					$("#edit_expect_sal").val(response.data.expec_salary);
					$("#edit_skils").val(response.data.skills);
					$("#edit_new_company").val(response.data.new_company_name);
					$('#status option[value="' + response.data.status + '"]').prop(
						"selected",
						true,
					);
					$(
						'#job_status option[value="' + response.data.job_status + '"]',
					).prop("selected", true);
				} else {
					$("#error_msg").text(response.message);
				}
			},
			"json",
		);

		$("#EditModal").modal("show");
	});

	$("body").on("click", ".btn-delete-modals", function () {
		var student = $(this).closest("tr").find("td:eq(1)").text();
		var abc = confirm("You want to delete this record");
		if (abc) {
			$.post(
				"remove_seeker_details",
				{
					Student_id: student,
				},
				function (response) {
					$("#error_msg").empty();
					if (response.status == 200) {
						location.href = "welcome";
						console.log(response);
						$("#error_msg").text(response.message);
					} else {
						//location.href = "welcome";
						console.log(response);
						$("#error_msg").text(response.message);
					}
				},
				"json",
			);
		} else {
			console.log(abc);
		}
	});

	$("#update_data").click(function () {
		var edit_Student_id = $("#edit_userid").val();
		var edit_name = $("#edit_name").val();
		var edit_mobile = $("#edit_contact").val();
		var edit_age = $("#edit_age").val();
		var edit_email = $("#edit_email").val();
		var edit_degree = $("#edit_qualification").val();
		var edit_address = $("#edit_address").val();
		var edit_curr_location = $("#edit_curre_locat").val();
		var edit_c_courses = $("#edit_certify_course").val();
		var edit_t_courses = $("#edit_training_course").val();
		var edit_experience = $("#edit_exp").val();
		var edit_company_name = $("#edit_company").val();
		var edit_job_title = $("#edit_title").val();
		var edit_years_in_job = $("#edit_years_exp").val();
		var edit_pres_salary = $("#edit_present_sal").val();
		var edit_expec_salary = $("#edit_expect_sal").val();
		var edit_skills = $("#edit_skils").val();
		var edit_status = $("#status").val();
		var edit_job_status = $("#job_status").val();
		var edit_new_company = $("#edit_new_company").val();
		console.log(edit_new_company);
		$.post(
			"update_seeker_details",
			{
				edit_Student_id: edit_Student_id,
				edit_name: edit_name,
				edit_mobile: edit_mobile,
				edit_age: edit_age,
				edit_email: edit_email,
				edit_degree: edit_degree,
				edit_address: edit_address,
				edit_curr_location: edit_curr_location,
				edit_c_courses: edit_c_courses,
				edit_t_courses: edit_t_courses,
				edit_experience: edit_experience,
				edit_company_name: edit_company_name,
				edit_job_title: edit_job_title,
				edit_years_in_job: edit_years_in_job,
				edit_pres_salary: edit_pres_salary,
				edit_expec_salary: edit_expec_salary,
				edit_skills: edit_skills,
				edit_status: edit_status,
				edit_job_status: edit_job_status,
				edit_new_company: edit_new_company,
			},
			function (response) {
				$("#error_msg").empty();
				if (response.status == 200) {
					location.href = "welcome";
					//$('#EditModal').modal('hide');
					$("#error_msg").text(response.message);
				} else {
					$("#error_msg").text(response.message);
				}
			},
			"json",
		);
	});
});
