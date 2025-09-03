$(document).ready(function () {

    $('body').on('click','#add_course', function () {
        $('#add_courseModel').modal('show');
    });
    $('body').on('click','.btn-course-update', function () {
        $('#edit_courseModel').modal('show');
        $('#course_id').val($(this).closest('tr').find("td:eq(1)").text())
        $('#edit_course_name').val($(this).closest('tr').find("td:eq(2)").text());
        var parent = $(this).closest('tr').find("td:eq(3)").text();
        $("#edit_sub_course_of option[value='" + parent + "']").prop("selected", true);
    });

    $('body').on('click','#add_employer', function () {
        $('#add_employeModel').modal('show');
    });

    $('body').on('click','.btn-employer-update', function () {
        $('#edit_employeModel').modal('show');
        $('#employer_id').val($(this).closest('tr').find("td:eq(1)").text());
        $('#edit_employer_name').val($(this).closest('tr').find("td:eq(2)").text());
        $('#edit_employer_email').val($(this).closest('tr').find("td:eq(3)").text());
        $('#edit_company_name').val($(this).closest('tr').find("td:eq(5)").text());
        $('#edit_designation').val($(this).closest('tr').find("td:eq(6)").text());
        $('#edit_employer_mobile').val($(this).closest('tr').find("td:eq(4)").text());

    });

    $('body').on('click','.btn-course-delete', function () {
        var a = confirm('Do you want to delete this course.');
        if (a) {
            var courseId = $(this).closest('tr').find("td:eq(1)").text();
            $.post(APP_URL + 'welcome/delete_course', {
                courseId: courseId
            },
            function (response)
            {
                console.log(response)
                $('#courseError').empty();
                if (response.status == 200) {
                    $('#courseError').text(response.message);
                    window.location = APP_URL + 'welcome/add_course';
                } else {
                    $('#courseError').text(response.message);
                }
            }, 'json');
        } else {

        }
    });

    $('#edit_course_form').validate({
        rules: {
            edit_course_name: {
                required: true,
            }
        },
        messages: {
            edit_course_name: {
                required: "Course Name is required.",
            }
        },
        onkeyup: false,
        submitHandler: function (form) {
            var course_id = $('#course_id').val();
            var edit_course_name = $("#edit_course_name").val();
            var edit_sub_course_of = $("#edit_sub_course_of").val();

            $.post(APP_URL + 'welcome/edit_course', {
                course_id: course_id,
                edit_course_name: edit_course_name,
                edit_sub_course_of: edit_sub_course_of
            },
            function (response) {
                $('#error_edit').empty();
                if (response.status == 200) {
                    $('#error_edit').text(response.message);
                     location.reload();
                } else {
                    $('#error_edit').text(response.message);
                }

            }, 'json');
        }
    });


    $('#add_course_form').validate({
        rules: {
            course_name: {
                required: true,
            }
        },
        messages: {
            course_name: {
                required: "Course Name is required.",
            }
        },
        onkeyup: false,
        submitHandler: function (form) {
            var course_name = $("#course_name").val();
            var sub_course_of = $("#sub_course_of").val();

            $.post(APP_URL + 'login/addNewCourse', {
                course_name: course_name,
                sub_course_of: sub_course_of
            },
            function (response) {
                $('#error_course').empty();
                console.log(response)
                if (response.status == 200) {
                    $('#error_course').text(response.message);
                    $('input').empty();
                    location.reload();
                }
                else {
                    $('#error_course').text(response.message);
                }
            }, 'json');
        }
    });

//   edit employer form      
    $('#edit_employer_form').validate({
        rules: {
            edit_employer_name: {
                required: true,
            },
            edit_employer_email: {
                required: true,
            },
            edit_company_name: {
                required: true,
            }, edit_designation: {
                required: true,
            }, edit_employer_mobile: {
                required: true,
            }
        },
        messages: {
            edit_employer_name: {
                required: "Employer Name is required.",
            },
            edit_employer_email: {
                required: "Email is required.",
            },
            edit_company_name: {
                required: "Company Name is required.",
            },
            edit_designation: {
                required: "Designation is required.",
            },
            edit_employer_mobile: {
                required: "Contact is required.",
            }
        },
        onkeyup: false,
        submitHandler: function (form) {
            var employer_id = $('#employer_id').val();
            var edit_employer_name = $("#edit_employer_name").val();
            var edit_employer_email = $("#edit_employer_email").val();
            var edit_company_name = $("#edit_company_name").val();
            var edit_designation = $("#edit_designation").val();
            var edit_employer_mobile = $("#edit_employer_mobile").val();

            $.post(APP_URL + 'welcome/edit_employer', {
                employer_id: employer_id,
                edit_employer_name: edit_employer_name,
                edit_employer_email: edit_employer_email,
                edit_company_name: edit_company_name,
                edit_designation: edit_designation,
                edit_employer_mobile: edit_employer_mobile

            },
            function (response) {
                $('#errEmpUpdate').empty();
                console.log(response)
                if (response.status == 200) {
                    $('#errEmpUpdate').text(response.message);
                    $('input').empty();
                    location.reload();
                }
                else {
                    $('#errEmpUpdate').text(response.message);
                }
            }, 'json');
        }
    });

    $('body').on('click','.btn-employer-delete', function () {
        var empDel = confirm('Do you want to delete this course.');
        if (empDel) {
            var empId = $(this).closest('tr').find("td:eq(1)").text();
            console.log(empId)
            $.post(APP_URL + 'welcome/delete_employe', {
                empId: empId
            },
            function (response)
            {
                console.log(response)
                $('#errorEmp').empty();
                if (response.status == 200) {
                    $('#errorEmp').text(response.message);
                    window.location = APP_URL + 'welcome/employerRegister';
                } else {
                    $('#errorEmp').text(response.message);
                }
            }, 'json');
        } else {

        }
    });

// company search
    $('#companySearch').selectpicker();
    $('#companySearch').on('change', function () {

        var company = $('#companySearch').val();
        console.log(company)
        $.post(APP_URL + 'welcome/serchCompany', {
            company: company
        },
        function (response)
        {
            console.log(response)
            $('#table_box tbody').empty();
            var content = '';
            var i = 1;
            if (response.status == 200) {
                $.each(response.company, function (k, v) {
                    content += "<tr>\n\
                            <td>" + i + "</td>\n\
                            <td style='display:none'>" + v.id + "</td>\n\
                            <td>" + v.name + "</td>\n\
                            <td>" + v.email + "</td>\n\
                            <td>" + v.mobile + "</td>\n\
                            <td>" + v.company_name + "</td>\n\
                            <td>" + v.designation + "</td>\n\
                            <td align='center'><a href='javascript:void(0);' data-id=" + v.id + " class='glyphicon glyphicon-pencil btn-employer-update' title='Edit'></a>&nbsp;&nbsp;\n\
                            <a href='javascript:void(0);' data-id=" + v.id + " class='glyphicon glyphicon-trash btn-employer-delete' title='Delete'></a>&nbsp;\n\
                             </td>";
                    $('#searchBody').html(content);
                  i++;
                });
            }
        }, 'json');
    });
});
