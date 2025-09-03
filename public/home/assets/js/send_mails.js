/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {

    $('#get_mail_list').on('click', function () {
        var subtract = 0;
        var stat_val = $('#stat_val').val();
        var end_val = $('#end_val').val();
        var userId = [];
        var mail_array = [];
        var resume = [];
        if (end_val == '' && stat_val == '') {
            alert('Please enter the student list.');
            return false;
        }
        if (end_val == '') {
            subtract = parseInt(stat_val);
        } else {
            subtract = parseInt(end_val) - parseInt(stat_val);
        }
        if (subtract == 0) {
            subtract = 1;
        }
        if (subtract > 20) {
            $('#send_error').text('You Should select limits with in 20');
            $('#email_list').empty();
            $('#stat_val').val('');
            $('#end_val').val('');
            $("#stat_val").focus();
        } else {
            $.post(APP_URL + 'welcome/student_mail_list', {
                list: subtract
            },
            function (response) {
                $('#send_error').empty();
                $('#email_list').empty();
                var content = '';
                if (response.status == 200) {
                    content += "<table class='table table-bordered'><tr>";
                    content += "<th>Name</th><th>Email</th><th>Contact</th></tr>"
                    $.each(response.data, function (k, v) {
                        content += "<tr><td>" + v['name'] + "</td>";
                        content += "<td>" + v['email'] + "</td>";
                        content += "<td>" + v['mobile'] + "</td></tr>";
                        userId.push(v['userId']);
                        mail_array.push(v['email']);
                        resume.push(v['resume_name']);
                    });
                    $('#student_ids').val(userId);
                    $('#mail_array').val(mail_array);
                    $('#resume').val(resume);
                    content += "</table>";
                    $('#email_list').append(content);

                } else if (response.status == 201) {
                    $('#email_list').text(response.data);
                }
                else {
                    $('#email_list').text('Bad Server Request.');
                }

            }, 'json');

        }
    });


    $('.send-detail-form').validate({
        rules: {
            to_mail: {
                required: true,
            },
            subject: {
                required: true,
            },
            message: {
                required: true,
            }
        },
        messages: {
            to_mail: {
                required: "Email id is required",
            },
            subject: {
                required: "Subject is required.",
            },
            message: {
                required: "Message is required.",
            }
        },
        onkeyup: false,
        submitHandler: function (form) {
            var to_mail = $('#to_mail').val();
            var subject = $("#subject").val();
            var message = $("#message").val();
            var student_ids = $('#student_ids').val();
            var mail_array = $('#mail_array').val();
            var attachment = $('#resume').val();

            $.post(APP_URL + 'welcome/send_mail_list', {
                to_mail: to_mail,
                subject: subject,
                message: message,
                student_ids: student_ids,
                mail_array: mail_array,
                attachment: attachment
            },
            function (response) {
                $('#send_error').empty();
                if (response.status == 200) {
                    $('#send_error').html("<div class='alert alert-success fade in'>\n\
                        <button class='close' type='button' data-dismiss='alert'>x</button>\n\
                        <strong>Sucessfully send the message.</strong></div>");
                    $('input').val('');
                    $("#email_list").hide();
                }
                else if (response.status == 201) {
                    $('#send_error').text(response.message);
                }
                else {
                    $('#send_error').text('Bad server. Please try again');
                }
            }, 'json');
        }
    });
});

