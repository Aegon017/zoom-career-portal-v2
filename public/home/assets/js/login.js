$(document).ready(function () {
	$("#admin-login").click(function () {
		$("#login-form").validate({
			rules: {
				inputEmail3: {
					required: true,
					email: true,
				},
				inputPassword3: {
					required: true,
				},
			},
			onkeyup: false,
			messages: {
				inputEmail3: {
					required: "User Email is required.",
					email: "Enter a valid email.",
				},
				inputPassword3: {
					required: "Password is required.",
				},
			},
			submitHandler: function (form) {
				var email = $("#inputEmail").val();
				var password = $("#inputPassword").val();
				console.log(email);
				/*Validating user supplied credentials*/
				$.post(
					APP_URL + "login/verify",
					{
						email: email,
						password: password,
					},
					function (response) {
						if (response.status == true) {
							$("#errJobseeker").empty();
							//console.log('success');
							window.location.href = APP_URL + "login/welcome";
						} else {
							$("#errJobseeker").empty();
							$("#errJobseeker").html(
								"<div class='alert alert-danger fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>Incorrect Email or Password</strong></div>",
							);
						}
					},
					"json",
				);
				return false;
			},
		});
	});
	$("#jobseeker-login").click(function () {
		$("#login-form-jobseeker").validate({
			rules: {
				inputEmail3: {
					required: true,
					email: true,
				},
				inputPassword3: {
					required: true,
				},
			},
			onkeyup: false,
			messages: {
				inputEmail3: {
					required: "User Email is required.",
					email: "Enter a valid email.",
				},
				inputPassword3: {
					required: "Password is required.",
				},
			},
			submitHandler: function (form) {
				var email = $("#inputEmail3").val();
				var password = $("#inputPassword3").val();
				/*Validating user supplied credentials*/
				$.post(
					APP_URL + "remote/login",
					{
						email: email,
						password: password,
					},
					function (response) {
						if (response.status == true) {
							$("#errJobseeker").empty();
							window.location.href = APP_URL + "jobseeker/dashboard";
						} else {
							$("#errJobseeker").empty();
							$("#errJobseeker").html(
								"<div class='alert alert-danger fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>Incorrect Email or Password</strong></div>",
							);
						}
					},
					"json",
				);
				return false;
			},
		});
	});
	$("#login-form-admin").validate({
		rules: {
			inputEmail3: {
				required: true,
				email: true,
			},
			inputPassword3: {
				required: true,
			},
		},
		onkeyup: false,
		messages: {
			inputEmail3: {
				required: "Admin Email is required.",
				email: "Enter a valid email.",
			},
			inputPassword3: {
				required: "Password is required.",
			},
		},
		//         errorPlacement: function(error, element) {
		//             $(".register-error-box").show();
		//            error.appendTo('.inputPassword3');
		//            error.appendTo('.inputEmail3');
		//        },
		submitHandler: function (form) {
			var email = $("#inputEmail3").val();
			var password = $("#inputPassword3").val();
			/*Validating user supplied credentials*/
			$.post(
				APP_URL + "admin/verify_admin",
				{
					email: email,
					password: password,
				},
				function (response) {
					if (response.status == true) {
						$("#errJobseeker").empty();
						//console.log('success');
						window.location.href = APP_URL + "admin/welcome";
					} else {
						$("#errJobseeker").empty();
						$("#errJobseeker").html(
							"<div class='alert alert-danger fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>Incorrect Email or Password</strong></div>",
						);
					}
				},
				"json",
			);
			return false;
		},
	});

	$("#forgot-password").on("click", function () {
		//console.log('hiii');
		var email = $("#inputEmail3").val();
		//console.log(email);
		$.ajax({
			url: APP_URL + "registration/checkEmailAvailabilityEmployer",
			type: "POST",
			data: "jobseeker_email=" + email,
			success: function (res) {
				//console.log(res,res.trim());
				if (res.trim() == "true") {
					$("#errJobseeker").empty();
					$("#errJobseeker").html(
						"<div class='alert alert-danger fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>No Employer with this Email</strong></div>",
					);
				} else {
					$.ajax({
						url: APP_URL + "registration/forgotPassword",
						type: "POST",
						data: "jobseeker_email=" + email,
					});
					$("#errJobseeker").empty();
					$("#errJobseeker").html(
						"<div class='alert alert-success fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>Please check your mail for New Password.</strong></div>",
					);
				}
			},
		});
	});

	$("#forgot-password-jobseeker").on("click", function () {
		//console.log('hiii');
		var email = $("#inputEmail3").val();
		//console.log(email);
		$.ajax({
			url: APP_URL + "registration/checkEmailAvailability",
			type: "POST",
			data: "jobseeker_email=" + email,
			success: function (res) {
				//console.log(res,res.trim());
				if (res.trim() == "true") {
					$("#errJobseeker").empty();
					$("#errJobseeker").html(
						"<div class='alert alert-danger fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>No Jobseeker with this Email.Please check your Email below.</strong></div>",
					);
				} else {
					$.ajax({
						url: APP_URL + "registration/forgotPasswordJobseeker",
						type: "POST",
						data: "jobseeker_email=" + email,
					});
					$("#errJobseeker").empty();
					$("#errJobseeker").html(
						"<div class='alert alert-success fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>Please check your mail for New Password.</strong></div>",
					);
				}
			},
		});
	});
	$("#forget_password").hide();
	$("#forget_password_link").click(function () {
		$("#forget_password").show();
		$("#jobseeker_login").hide();
	});
	$("#jobseeker_forget_password").validate({
		rules: {
			forget_pass: {
				required: true,
				email: true,
			},
		},
		onkeyup: false,
		messages: {
			forget_pass: {
				required: "Email is required.",
				email: "Enter a valid email.",
			},
		},
		submitHandler: function (form) {
			var email = $("#forget_pass").val();
			$.post(
				APP_URL + "registration/forgotPasswordJobseeker",
				{
					email: email,
				},
				function (response) {
					$("#errForgetPass").empty();
					if ((response.status = 1000)) {
						$("#errForgetPass").html(
							"<div class='alert alert-success fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>" +
								response.message +
								"</strong></div>",
						);
						$("#forget_pass").val("");
					} else {
						$("#errForgetPass").html(
							"<div class='alert alert-danger fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>" +
								response.message +
								"</strong></div>",
						);
						$("#forget_pass").val("");
					}
				},
				"json",
			);
			return false;
		},
	});
});
