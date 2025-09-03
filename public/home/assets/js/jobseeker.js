/**
 * 
 * This js file is used to do validation for jobseeker
 * and submit data into database
 */
$(document).ready(function () {

    //-------------------------------------------------------------------------
    /** 
     * This script is used to do validation for character
     */
    $.validator.addMethod("charOnly", function (value, element) {
        return this.optional(element) || /^[A-Za-z\s]*$/.test(value)
    });

    //------------------------------------------------------------------------
    /**
     * This script is used to do validation of jobseeker registration form
     */
    $('#job-seeker-form').validate({
        rules: {
            userName: {
                required: true,
                charOnly: true
            },
            email: {
                required: true,
                maxlength: 255,
                email: true,
                remote: {
                    type: 'POST',
                    url: APP_URL + 'registration/checkEmailAvailability'
                }
            },
            mobile: {
                required: true,
                minlength: 10,
                maxlength: 12
            },
            password: {
                required: true,
                minlength: 6
            },
            conf_password: {
                required: true,
                minlength: 6,
                equalTo: "#password"
            }
        },
        messages: {
            userName: {
                required: "Name is required.",
                charOnly: "Only aplphbets allowed."
            },
            email: {
                required: "Email is required.",
                maxlength: "Maximum 255 alphabets allowed.",
                email: "Not a valid email",
                remote: "Email is already registered."
            },
            mobile: {
                required: "Mobile is required.",
                minlength: 10,
                maxlength: "Maximum 12 digits allowed."
            },
            password: {
                required: "Password is required.",
                minlength: 'Password field is min 6 characters'
            },
            conf_password: {
                required: "Confirm Password is required.",
                minlength: 'Password field is min 6 characters',
                equalTo: 'Confirm password does not match.'
            }
        },
        onkeyup: false,
        submitHandler: function (form) {
            var userName = $("#userName").val();
            var email = $("#email").val();
            var mobile = $("#mobile").val();
            var password = $('#password').val();
            // var overall = $("#overall").val();
            // var experience = $("#experience").val();
            //  var training = $("#training").val();
            //  var address = $("#address").val();
            //  var currentAddress = $("#currentAddress").val();

            $.post(APP_URL + 'registration/addNewJobseeker', {
                userName: userName,
                email: email,
                mobile: mobile,
                password: password
                        // overall: overall,
                        // experience: experience,
                        // training: training,
                        // address: address,
                        // currentAddress: currentAddress,
            },
            function (response) {
                $("html, body").animate({scrollTop: 0}, "slow");
                if (response.status === 1000) {
                    //success, do something here
                    $('#errJobseeker').empty();
                    $('#errJobseeker').html("<div class='alert alert-success fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>" + response.message + "</strong></div>");
                } else {
                    //unknown error, bad bad server
                    $('#errJobseeker').empty();
                    $('#errJobseeker').html("<div class='alert alert-danger fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>" + response.message + "</strong></div>");
                }
            }, 'json');


        }
    });

    //------------------------------------------------------------------------
    /**
     * This script is used to do validation of employer registration form
     */
    $('#employer_form').validate({
        rules: {
            jobseeker_name: {
                required: true,
                charOnly: true
            },
            jobseeker_email: {
                required: true,
                maxlength: 255,
                email: true,
                remote: {
                    type: 'POST',
                    url: APP_URL + 'registration/checkEmailAvailabilityEmployer'
                }
            },
            jobseeker_mobile: {
                required: true,
                minlength: 10,
                maxlength: 12
            },
            company_name: {
                required: true
            },
            designation: {
                required: true,
                maxlength: 255
            }
        },
        messages: {
            jobseeker_name: {
                required: "Name is required.",
                charOnly: "Only aplphbets allowed."
            },
            jobseeker_email: {
                required: "Email is required.",
                maxlength: "Maximum 255 alphabets allowed.",
                email: "Not a valid email",
                remote: "Email is already registered."
            },
            jobseeker_mobile: {
                required: "Mobile is required.",
                minlength: 10,
                maxlength: "Maximum 12 digits allowed."
            },
            company_name: {
                required: "Company name  is required."
            },
            designation: {
                required: "Designation is required.",
                maxlength: "Maximum 255 character allowed."
            }
        },
        onkeyup: false,
        submitHandler: function (form) {
            var jobseeker_name = $("#jobseeker_name").val();
            var jobseeker_email = $("#jobseeker_email").val();
            var jobseeker_mobile = $("#jobseeker_mobile").val();
            var company_name = $("#company_name").val();
            var designation = $("#designation").val();

            $.post(APP_URL + 'registration/addNewJobseekerEmployer', {
                jobseeker_name: jobseeker_name,
                jobseeker_email: jobseeker_email,
                jobseeker_mobile: jobseeker_mobile,
                company_name: company_name,
                designation: designation,
            },
                    function (response) {
                   $('#errJobseeker').empty();
                        $("html, body").animate({scrollTop: 0}, "slow");
                        if (response.status === 1000) {
                            //success, do something here
                            $('#errJobseeker').show();
                            $('#errJobseeker').html("<div class='alert alert-success fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>" + response.message + "</strong></div>");
                        } else {
                            //unknown error, bad bad server
                            $('#errJobseeker').show();
                            $('#errJobseeker').html("<div class='alert alert-danger fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>" + response.message + "</strong></div>");
                        }
                    }, 'json');


        }
    });

    //------------------------------------------------------------------------
    /**
     * This script is used to do validation of jobseeker update form
     */
    $('#job-seeker-profile-form').validate({
        rules: {
            name: {
                required: true,
                charOnly: true
            },
//            email: {
//                required: true,
//                maxlength: 255,
//                email: true,
////                remote: {
////                    type: 'POST',
////                    url: APP_URL + 'registration/checkEmailAvailability'
////                }
//            },
            mobile: {
                required: true,
                minlength: 10,
                maxlength: 12
            },
            curr_location: {
                required: true
            },
            age: {
                required: true
            },
            degree: {
                required: true
            },
            c_courses: {
                required: true
            },
            t_courses: {
                required: true
            },
            skills: {
                required: true,
                maxlength: 400
            },
            experience:{
                required: true
            }
        },
        messages: {
            name: {
                required: "Name is required.",
                charOnly: "Only aplphbets allowed."
            },
//            email: {
//                required: "Email is required.",
//                maxlength: "Maximum 255 alphabets allowed.",
//                email: "Not a valid email",
//                //remote: "Email is already registered."
//            },
            mobile: {
                required: "Mobile is required.",
                minlength: 10,
                maxlength: "Maximum 12 digits allowed."
            },
            curr_location: {
                required: "Current Location is required"
            },
            age: {
                required: "Age is required"
            },
            degree: {
                required: "Degree is required"
            },
            c_courses: {
                required: "Certified Courses is required"
            },
            t_courses: {
                required: "Undergone Training Courses is required"
            },
            skills: {
                required: "Skills is required",
                maxlength: "Description not be more than 400 words."
            },
            experience:{
                required: "Experience is required"
            }
        },
        onkeyup: false,
        submitHandler: function (form) {
            // form.preventDefault();
            var name = $("#userName").val();
            var email = $("#email").val();
            var mobile = $("#mobile").val();
            var curr_location = $("#curr_location").val();
            var age = $("#age").val();
            var degree = $("#degree").val();
            var c_courses = $("#c_courses").val();
            var t_courses = $("#t_courses").val();
            var skills = $("#skills").val();
            var password1 = $("#password1").val();
            var password2 = $("#password2").val();
            var company_name = $("#company_name").val();
            var job_title = $("#job_title").val();
            var years_in_curr_job = $("#years_in_curr_job").val();
            var pres_salary = $("#pres_salary").val();
            var experience = $("#experience").val();
            var expec_salary = $("#expec_salary").val();

            $.post(APP_URL + 'jobseeker/jobseeker_update', {
                name: name,
                email: email,
                mobile: mobile,
                curr_location: curr_location,
                age: age,
                degree: degree,
                c_courses: c_courses,
                t_courses: t_courses,
                skills: skills,
                password1: password1,
                password2: password2,
                company_name: company_name,
                job_title: job_title,
                years_in_curr_job: years_in_curr_job,
                pres_salary: pres_salary,
                experience: experience,
                expec_salary: expec_salary
            },
                    function (response) {
                        $("html, body").animate({scrollTop: 0}, "slow");
                        if (response.status === 1000) {
                            //success, do something here
                            $('#errJobseeker').empty();
                            $('#errJobseeker').html("<div class='alert alert-success fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>" + response.message + "</strong></div>");
                        } else {
                            //unknown error, bad bad server
                            $('#errJobseeker').empty();
                            $('#errJobseeker').html("<div class='alert alert-danger fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>" + response.message + "</strong></div>");
                        }
                    }, 'json');
        }
    });
    // cancel password
    $('#cancel_password').on('click', function () {
        $('#cancel_password').hide();
        $('#password1').attr('disabled', 'disabled');
        $('#password2').attr('disabled', 'disabled');

        $('#change_password').text('Change Password');
        $(this).addClass('btn-success');
        $(this).removeClass('btn-primary');
        $('.form-group').each(function (k, v) {
            if (k > 2)
                $(this).show();
        });
    });

    // cancel update resume
    $('#cancel_upload').on('click', function () {
        $('#cancel_upload').hide();
        $('#add_resume').attr('disabled', 'disabled');

        $('#upload_resume').text('Upload Resume');
        $(this).addClass('btn-success');
        $(this).removeClass('btn-primary');
        $('.form-group').each(function (k, v) {
            if (k > 3)
                $(this).show();
        });
    });

    $('#upload_resume').on('click', function () {
        $('#cancel_upload').show();
        if ($(this).text() == "Upload Resume")
        {
            $('#add_resume').removeAttr('disabled');
            $('#add_resume').focus();
            $('#upload_resume').text('Update Resume');
            $(this).removeClass('btn-success');
            $(this).addClass('btn-primary');
            $('.form-group').each(function (k, v) {
                if (k > 3)
                    $(this).hide();
            });
        }
        else {
            var email = $('#email').val();
            var file_data = $("#add_resume").prop("files")[0];
            var form_data = new FormData();
            form_data.append("file", file_data)
            console.log(form_data)
            $.ajax({
                url: APP_URL + 'jobseeker/jobseeker_upload_resume',
                dataType: 'script',
                contentType: false,
                processData: false,
                data: form_data,
                type: 'POST'
            })
                    .done(function (response) {
                        var res = $.parseJSON(response.responseText);
                        $('#errJobseeker').empty();
                        if (res.status == 1000)
                        {
                            $('#errJobseeker').html("<div class='alert alert-success fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>" + res.message + "</strong></div>");
                            $('#add_resume').attr('disabled', 'disabled');
                            $('#upload_resume').text('Upload Resume');
                            $(this).addClass('btn-success');
                            $(this).removeClass('btn-primary');
                            $('.form-group').each(function (k, v) {
                                if (k > 3)
                                    $(this).show();
                            });
                        }
                         else  if (res.status == 1200){
                            $('#errJobseeker').html("<div class='alert alert-danger fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>"+res.message+"</strong></div>");
                        }
                    })
                    .fail(function (response) {
                        var res = $.parseJSON(response.responseText);
                         if (res.status == 1200){
                            $('#errJobseeker').html("<div class='alert alert-danger fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>"+ res.message +"</strong></div>");
                        }
                     else{
                        $('#errJobseeker').html("<div class='alert alert-success fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>" + res.message + "</strong></div>");
                      }
                    });
                }
    });
    // Change password for jobseeker
    $('#change_password').on('click', function () {
        $('#cancel_password').show();
        if ($(this).text() == "Change Password")
        {

            $('#password1').removeAttr('disabled');
            $('#password2').removeAttr('disabled');
            $('#password1').focus();

            $('#change_password').text('Update Password');
            $(this).removeClass('btn-success');
            $(this).addClass('btn-primary');
            $('.form-group').each(function (k, v) {
                if (k > 2)
                    $(this).hide();
            });
        }
        else
        {

            var email = $('#email').val();
            var pass1 = $('#password1').val();
            var pass2 = $('#password2').val();
            if (pass1 == '')
            {
                alert('Please Enter New Password');
                $('#password1').focus();
                return false;
            }
            else if (pass1 != pass2)
            {
                alert('Passwords Mismatch.Please try again.');
                return false;
            }
            else
            {
                $.blockUI();
                $.ajax({
                    url: APP_URL + 'jobseeker/jobseeker_update_password',
                    type: 'POST',
                    data: 'email=' + email + '&password=' + pass1,
                    dataType: 'json',
                    success: function (response) {
                        $.unblockUI();
                        if (response.status == 1000)
                        {

                            $('#errJobseeker').empty();
                            $('#errJobseeker').html("<div class='alert alert-success fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>" + response.message + "</strong></div>");
                            $('#password1').attr('disabled', 'disabled');
                            $('#password2').attr('disabled', 'disabled');


                            $('#change_password').text('Change Password');
                            $(this).addClass('btn-success');
                            $(this).removeClass('btn-primary');
                            $('.form-group').each(function (k, v) {
                                if (k > 2)
                                    $(this).show();
                            });
                        }
                    }
                });
            }
        }
    });

    $(document).on('change', '#checkAll', function () {
        $(".checkbox1").prop('checked', $(this).prop("checked"));
    });


    // Data Table
    $('#table_box').dataTable({
                    "lengthMenu": [[20, 25, 50, 100, -1], [20, 25, 50, 100, "All"]],
                    "columnDefs": [{ "targets": [0], "searchable": false, "orderable": false, "visible": true }],
                    "fnInfoCallback": function( oSettings, iStart, iEnd, iMax, iTotal, sPre ) {
                       $("#checkAll,.checkbox1").prop('checked',false);
                    },
                    dom: 'Bfrtip',
                    buttons: [ {
                    extend: 'excelFlash',
                    filename: 'Data export',
                     "sDom": 'T<"clear">lfrtip',
        "oTableTools": {
            "aButtons": [
                {
                    "sExtends": "ajax",
                    "sButtonText": "Special columns",
                    "mColumns": [ 2, 3, 4 ]
                },
                {
                    "sExtends": "ajax",
                    "sButtonText": "Visible columns",
                    "mColumns": "visible"
                }
            ]
        }
            }]
                });/*  'copy', 'csv', 'pdf', 'print' */
    // users search
    $('#search_jobseekers').on('click', function () {

        var t_courses = $('#t_courses').val();
        var c_courses = $('#c_courses').val();
        var degree = $('#degree').val();
        var experience = $('#experience').val();
        var a_experience = $('#a_experience').val();
        var expec_salary = $('#expec_salary').val();
        var name = $('#name').val();
        var email = $('#email').val();
        var contact = $('#contact').val();
        $.blockUI();
        $.ajax({
            url: APP_URL + 'jobseeker/search',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {
                t_courses: t_courses,
                degree: degree,
                c_courses: c_courses,
                experience: experience,
                a_experience: a_experience,
                expec_salary: expec_salary,
                name: name, email: email, contact: contact
                
            },
//            'skills=' + skills + '&degree=' + degree + '&c_courses=' + c_courses + '&experience=' + experience + '&a_experience=' + a_experience + '&expec_salary=' + expec_salary,
            success: function (data) {
                $.unblockUI();
                var textt = '';
                var i = 1;
                $('#table_body_box').empty();
                if (data['status'] === 1000)
                {
                    textt += '<table class="table table-hover dataTables-example" id="table_box">';
                    textt += '<thead>';
                    textt += '<tr>';
                    textt += '<th><input type="checkbox" id="checkAll" /></th>';
                    textt += '<th>Userid</th>';
                    textt += '<th style="display:none">Userid</th>';
                    textt += '<th>Full Name</th>';
                    textt += '<th>Contact</th>';
                    textt += '<th style="display:none">Age</th>';
                    textt += '<th>Email</th>';
                    textt += '<th style="display:none">Qualification</th>';
                    textt += '<th style="display:none">Current Location</th>';
                    textt += '<th style="display:none">Address</th>';
                    textt += '<th >Certified Courses</th>';
                    textt += '<th >Undergone Training</th>';
                    textt += '<th>Experience</th>';
                    textt += '<th style="display:none">Company Name</th>';
                    textt += '<th style="display:none">Job Title</th>';
                    textt += '<th style="display:none">No. of years working</th>';
                    textt += '<th style="display:none">Present Salary</th>';
                    textt += '<th style="display:none">Expected Salary</th>';
                    textt += '<th style="display:none">Skills</th>';
                    textt += '<th style="display:none" >Resume Name</th>';
                    textt += '<th style="display:none" >Resume</th>';
                    textt += '<th >Job Status</th>';
                    textt += '<th >New Company</th>';
                    textt += '<th >Resume Date</th>';
                    textt += '<th >Action/ Resume</th>';
                    textt += '<th >Approval</th></tr>';
                    textt += '</head>';
                    textt += '<tbody>';

                    $.each(data['data'], function (k, v) {
                        textt += '<tr>';
                        if(v['status'] == 'active'){
                            textt += '<td><input type="checkbox" class="checkbox1" name="check[]" value="' + v['email'] + '"></td>';
                        }
                        else{
                            textt += '<td><input type="checkbox" disabled="true"></td>';
                        }
                        textt += '<td>' + v['userId'] + '</td>';
                        textt += '<td style="display:none">' + v['userId'] + '</td>';
                        textt += '<td>' + v['name'] + '</td>';
                        textt += '<td>' + v['mobile'] + '</td>';
                        textt += '<td style="display:none">' + v['age'] + '</td>';
                        textt += '<td>' + v['email'] + '</td>';
                        textt += '<td style="display:none">' + v['degree'] + '</td>';
                        textt += '<td style="display:none">' + v['address'] + '</td>';
                        textt += '<td style="display:none">' + v['curr_location'] + '</td>';
                        textt += '<td >' + v['c_courses'] + '</td>';
                        textt += '<td >' + v['t_courses'] + '</td>';
                        textt += '<td>' + v['experience'] + '</td>';
                        textt += '<td style="display:none">' + v['company_name'] + '</td>';
                        textt += '<td style="display:none">' + v['job_title'] + '</td>';
                        textt += '<td style="display:none">' + v['years_in_curr_job'] + '</td>';
                        textt += '<td style="display:none">' + v['pres_salary'] + '</td>';
                        textt += '<td style="display:none">' + v['expec_salary'] + '</td>';
                        textt += '<td style="display:none">' + v['skills'] + '</td>';
                        textt += '<td style="display:none">' + v['resume_name'] + '</td>';
                        textt += '<td style="display:none"></td>';
                        textt += '<td>' + v['Job_status'] + '</td>';
                        textt += '<td>' + v['new_company_name'] + '</td>';
                        textt += '<td>' + v['resume_date'] + '</td>';
                        if (v['resume_name'] == '') {
                        textt += '<td><a href="javascript:void(0);" class="glyphicon glyphicon-eye-open btn-document-new-modals"></a>\n\
                                          <a href="javascript:void(0);" class="glyphicon glyphicon-pencil btn-update-modals"></a>\n\
                                          <a href="javascript:void(0);" class="glyphicon glyphicon-trash btn-delete-modals"></a>\n\
                                          </td>';
                        }else{
                            textt += '<td><a href="javascript:void(0);" class="glyphicon glyphicon-eye-open btn-document-new-modals"></a>\n\
                                          <a href="javascript:void(0);" class="glyphicon glyphicon-pencil btn-update-modals"></a>\n\
                                          <a href="javascript:void(0);" class="glyphicon glyphicon-trash btn-delete-modals"></a>\n\
                                          <a href="' + APP_URL + "resumes/" + v['resume_name'] + '" target="blank" class="glyphicon glyphicon-paperclip" title="Resume"></a></td>';
                        }
                        if(v['status'] == 'active'){
                            textt += '<td class="btn-success">' + v['status'] + '</td>';
                        }else{
                            textt += '<td class="btn-primary">' + v['status'] + '</td>';
                        }
                        
                        i++;
                    });
                    textt += '</tr></tbody>';
                    textt += '</table>';
                    //console.log(textt);
                }

                $('#table_body_box').html(textt);
                $('#table_box').dataTable({
                    "lengthMenu": [[20, 25, 50, 100, -1], [20, 25, 50, 100, "All"]]
                });

            }
        });
    });

//get list of selected student details  ------------
    $('body').on('click', '#send_mails', function () {
       $('#send_error').empty();
       $('#to_mail').val('');
       $('#emp_company_name').text('');
       $('#emp_designation').text('');
       $('#emp_name').val('');
        var userId = [];
        var mail_array = [];
        var names_array = [];
        var experience_array = [];
        var qualification_array = [];
        var c_course_array = [];
        var t_course_array = [];
        var location_array = [];
        var age_array = [];
        var resume = [];
    //student id's array
        $(".checkbox1:checked").each(function () {
            var row = $(this).closest("tr");
            userId.push($(row).find('td:eq(1)').text());
        });
    //student mails array
        console.log(userId)
        $(".checkbox1:checked").each(function () {
            var row = $(this).closest("tr");
            mail_array.push($(row).find('td:eq(6)').text());
        });
    //student names array
        $(".checkbox1:checked").each(function () {
            var row = $(this).closest("tr");
            names_array.push($(row).find('td:eq(3)').text());
        });
    //student Location array
        $(".checkbox1:checked").each(function () {
            var row = $(this).closest("tr");
            location_array.push($(row).find('td:eq(9)').text());
        });
    //student qualification array
        $(".checkbox1:checked").each(function () {
            var row = $(this).closest("tr");
            qualification_array.push($(row).find('td:eq(7)').text());
        });
    //student cretificate course array
        $(".checkbox1:checked").each(function () {
            var row = $(this).closest("tr");
            c_course_array.push($(row).find('td:eq(10)').text());
            c_course_array.push('');
        });
    //student training course array
        $(".checkbox1:checked").each(function () {
            var row = $(this).closest("tr");
            t_course_array.push($(row).find('td:eq(11)').text());
            t_course_array.push('');
        });
    //student Experiance course array
        $(".checkbox1:checked").each(function () {
            var row = $(this).closest("tr");
            experience_array.push($(row).find('td:eq(12)').text());
        });
    //student skills array
        $(".checkbox1:checked").each(function () {
            var row = $(this).closest("tr");
            age_array.push($(row).find('td:eq(5)').text());
        });
    //student resume array
        $(".checkbox1:checked").each(function () {
            var row = $(this).closest("tr");
            resume.push($(row).find('td:eq(19)').text());
        });
        console.log(c_course_array)
        console.log(t_course_array)
        console.log(resume)

        if (userId != '' && mail_array != '') {
            $('#student_ids').val(userId);
            $('#student_names').val(names_array);
            $('#student_location').val(location_array);
            $('#student_Qualification').val(qualification_array);
            $('#student_c-course').val(c_course_array);
            $('#student_t-course').val(t_course_array);
            $('#student_age').val(age_array);
            $('#student_experiance').val(experience_array);
            $('#mail_array').val(mail_array);
            $('#resume').val(resume);
            $('#SendingmailModal').modal('show');
        } else {
            alert('You should select at least one jobseeker.');
        }
    });
 //--------------------------------------------------------------

 var ShowHide = $('#ShowHideColumns').val();
 if(ShowHide != ''){
     //  var table = $('#table_box').closest("tr");   
     $('#ShowHideColumns').on('load',function(){
          $.each(ShowHide, function (i, e) {
           $('.'+e).removeAttr("style");
        });
     });
     $('#ShowHideColumns').on('change',function(){
//       $('#table_box').closest("tr").find('th').css('display','none');
       ShowHide =  $('#ShowHideColumns').val();
       console.log(ShowHide)
     $.each(ShowHide, function (i, e) {
           $('.'+e).removeAttr("style");
        });
     });
 }

 $('body').on('change','#to_mail',function(){
     var to_mail = $('#to_mail').val();
      $.post(APP_URL + 'welcome/get_employee_details', {
          to_mail: to_mail
      },
      function (response) {
          $('#emp_company_name').empty();
          $('#emp_designation').empty();
          $('#emp_name').empty();
          if(response.status == 200){
              $('#emp_name').val(response.data[0].name);
              $('#emp_company_name').text(response.data[0].company_name);
              $('#emp_designation').text(response.data[0].designation);
          }
          else{
              $('#emp_name').empty();
              $('#emp_company_name').empty();
              $('#emp_designation').empty();
              $('#send_error').text(response.message);
          }
      }, 'json');
 });
    
//Send Student Details to employee ---------------
    $('.send-detail-form').validate({
        rules: {
            to_mail: {
                required: true,
            }
        },
        messages: {
            to_mail: {
                required: "Email id is required",
            }
        },
        onkeyup: false,
        submitHandler: function (form) {
            var to_mail = $('#to_mail').val();
            var emp_name = $('#emp_name').val();
            var student_ids = $('#student_ids').val();
            var mail_array = $('#mail_array').val();
            var student_names = $('#student_names').val();
            var student_location = $('#student_location').val();
            var student_Qualification = $('#student_Qualification').val();
            var student_c_course = $('#student_c-course').val();
            var student_t_course = $('#student_t-course').val();
            var student_age = $('#student_age').val();
            var student_experiance = $('#student_experiance').val()
            var attachment = $('#resume').val();
            console.log(student_ids)
            $.post(APP_URL + 'welcome/send_mail_list_to_emp', {
                to_mail: to_mail, emp_name: emp_name,
                student_names: student_names,
                student_location: student_location,
                student_Qualification: student_Qualification,
                student_c_course: student_c_course,
                student_t_course: student_t_course,
                student_age: student_age,
                student_experiance:student_experiance,
                student_ids: student_ids,
                mail_array: mail_array,
                attachment: attachment
            },
            function (response) {
                console.log(response)
                $('#send_error').empty();
                if (response.status == 200) {
                    $('#send_error').html("<div class='alert alert-success fade in'>\n\
                        <strong>Sucessfully send the message.</strong></div>");
                    $('input').val('');
                    $("#email_list").hide();
                }
                else if (response.status == 201) {
                    console.log(response)
                    $('#send_error').html("<div class='alert alert-danger fade in'>\n\
                        <strong>"+response.message+"</strong></div>");
                }
                else {
                    console.log(response)
                    $('#send_error').html("<div class='alert alert-danger fade in'>\n\
                        <strong>Bad server Request. Please try again.</strong></div>");
                }
            }, 'json');
        }
    });
    
    
// Mails To Jobseeker Model content
    $('body').on('click', '#send_mails_to_jobseeker', function () {
       $('#seeker_send_error').empty();
       $('#subject').empty();
       $('#message').empty();
        var mail_array = [];

        $(".checkbox1:checked").each(function () {
            var row = $(this).closest("tr");
            mail_array.push($(row).find('td:eq(4)').text());
        });
        //console.log(mail_array);
        if ( mail_array != '') {
            $('#mail_array').val(mail_array);
            $('#Sendingmails_To_Seeker_Modal').modal('show');
        } else {
            alert('You should select at least one jobseeker.');
        }
    });
    
//Send Mail to Jobseeker ---------------
$('.send-mail_to_seeker-form').validate({
        rules: {
            
            subject:{
                required: true,
            },
            message:{
                required: true,
            }
        },
        messages: {
            
            subject:{
                required: 'Subject is required',
            },
            message:{
                required: 'Message is required',
            }
        },
        onkeyup: false,
        submitHandler: function (form) {
            var subject = $('#subject').val();
            var message = $('#message').val();
            var mail_array = $('#mail_array').val();


            $.post(APP_URL + 'welcome/send_mails_to_jobseeker', {
                subject: subject,
                message: message,
                mail_array: mail_array
            },
            function (response) {
                $('#seeker_send_error').empty();
                if (response.status == 200) {
                    $('#seeker_send_error').html("<div class='alert alert-success fade in'>\n\
                        <strong>Sucessfully send the message.</strong></div>");
                    $('input,textarea').val('');
                    $("#email_list").hide();
                }
                else if (response.status == 201) {
                     $('#seeker_send_error').html("<div class='alert alert-danger fade in'>\n\
                        <strong>"+response.message+"</strong></div>");
                }
                else {
                     $('#seeker_send_error').html("<div class='alert alert-danger fade in'>\n\
                        <strong>Bad server Request. Please try again.</strong></div>");
                }
            }, 'json');
        }
    });
});
