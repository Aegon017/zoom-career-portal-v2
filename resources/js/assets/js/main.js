$(document).ready(function () {
    //Sidebar Dropdown Menu
    $('.sidebar-item.has-childern > a').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        const $parent = $(this).parent();
        // Close other menus
        $('.sidebar-item').not($parent).removeClass('active').find('.sub-menu').slideUp();
        // Toggle current menu
        $parent.toggleClass('active');
        //$parent.find('.sub-menu').slideToggle();
    });

    //Sidebar Toggle
    $('#zc-sidebar-toggle').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#zc-sidebar').toggleClass('collapsed');
    });
    $(document).click(function () {
        $('#zc-sidebar').removeClass('collapsed');
    });

    //Dropdown Menu
    $('.zc-nav-item.zc-dropdown .zc-dropdown-btn').click(function (e) {
        e.preventDefault();
        e.stopPropagation(); // prevent bubbling up to document
        $d_menu = $(this).next('.zc-dropdown-menu');

        //Hide All other dropdowns
        $('.zc-dropdown-menu').not($d_menu).removeClass('show');

        //toggle class show
        $d_menu.toggleClass('show');
    });
    // Hide dropdown when clicking outside
    $(document).click(function () {
        $('.zc-nav-item.zc-dropdown .zc-dropdown-menu').removeClass('show');
    });

    /*$('#search_by_emptype').on('click', function(){
        $('#employement_type').toggle();
    })*/
    /*$('.zc-dropdown-field .dropdown-toggle').on('click', function(){
        $(this).closest('.zc-dropdown').toggle();
    })*/
    $('.zc-dropdown-field > input.dropdown-toggle').attr('readonly', true);
    // Toggle only the nearest dropdown
    $(document).on('click', '.zc-dropdown-field > input.dropdown-toggle', function () {
        var $wrapper = $(this).closest('.zc-dropdown-field');
        var $dropdown = $wrapper.find('.zc-dropdown');
        $('.zc-field-wrap .zc-dropdown').not($dropdown).hide(); // close others
        $dropdown.toggle();
    });
    /*$('#employement_type input[type="checkbox"]').on('change', function(){
        let selected = [];
        $('#employement_type input:checked').each(function(){
            selected.push($(this).val());
        })
        $('#search_by_emptype').val(selected.join(', '));
    })*/
    // Update only the clicked dropdown's input
    $(document).on('change', '.zc-dropdown input[type="checkbox"]', function () {
        var $wrapper = $(this).closest('.zc-dropdown-field');
        var selected = [];
        $wrapper.find('input[type="checkbox"]:checked').each(function () {
            selected.push($(this).val());
        });
        $wrapper.find('> input.dropdown-toggle').val(selected.join(', '));
    });
    // Filter only inside the relevant dropdown
    $(document).on('keyup', '.zc-dropdown-search', function () {
        var search = $(this).val().toLowerCase();
        var $options = $(this).closest('.zc-dropdown').find('.dropdown-options label');
        $options.each(function () {
            var text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(search));
        });
    });
    // Close dropdown on outside click
    /*$(document).on('click', function(e){
        if (!$(e.target).closest('.zc-dropdown-field').length) {
            $('#employement_type').hide();
        }
    })*/
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.zc-dropdown-field').length) {
            $('.zc-field-wrap .zc-dropdown').hide();
        }
    });
    //Accordions
    $('.zc-accordion-header').click(function () {
        var content = $(this).next('.zc-accordion-content');

        content.slideToggle(200, () => {
            $(this).toggleClass('active');
        });
    });
    //zc filter toggle
    $('.zc-filter-wrapper .filter-header').click(function () {
        var content = $(this).next('.filter-content');

        content.slideToggle(200, () => {
            $(this).toggleClass('active');
        });
    });

    //zc date field
    $('.zc-date-field').datepicker({
        changeYear: true,
        changeMonth: true,
        dateFormat: 'dd/mm/yy',
    });

    /** Resume upload button triggers file upload **/
    $('.zc-resume-upload-wrapper #btn-upload').on('click', function () {
        $('.zc-resume-upload-wrapper #resume-file').click();
    });
    //file input change
    $('.zc-resume-upload-wrapper #resume-file').on('change', function () {
        var file = this.files[0];
        if (file) {
            var formData = new FormData();
            formData.append('file', file);
            $('.zc-resume-upload-wrapper #progess-container').show();

            $.ajax({
                url: 'upload-resume.php',
                type: 'post',
                data: formData,
                contentType: false,
                processData: false,
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener(
                            'progress',
                            function (e) {
                                if (e.lengthComputable) {
                                    var percent = Math.round((e.loaded / e.total) * 100);
                                    $('.zc-resume-upload-wrapper #progess-container #progress-bar').css('width', percent + '%');
                                }
                            },
                            false,
                        );
                    }
                    return xhr;
                },
                success: function (response) {
                    $('.zc-resume-upload-wrapper #progess-container #progress-bar').css('width', '100%');
                    setTimeout(function () {
                        $('.zc-resume-upload-wrapper #progess-container').fadeOut('slow');
                        $('#statusMsg').text('✅ Upload Successful!');
                        setTimeout(function () {
                            $('#statusMsg').fadeOut('slow', function () {
                                $(this).text('').show();
                            });
                        }, 3000);
                    }, 500);
                },
                error: function () {
                    $('.zc-resume-upload-wrapper #progess-container #progress-bar').css('width', '100%');
                    setTimeout(function () {
                        $('.zc-resume-upload-wrapper #progess-container').fadeOut('slow');
                        $('#statusMsg').text('❌ Upload Failed.');
                        setTimeout(function () {
                            $('#statusMsg').fadeOut('slow', function () {
                                $(this).text('').show();
                            });
                        }, 3000);
                    }, 500);
                },
            });

            //simulate progress
            /*let progress = 0;
            const interval = setInterval(function(){
                if(progress >= 100){
                    clearInterval(interval);
                }else{
                    progress += 10;
                    $('.zc-resume-upload-wrapper #progess-container #progress-bar').css('width', progress + '%');
                }
            }, 200);*/
        }
    });

    //Lightbox
    $('.zc-open-lightbox').on('click', function (e) {
        e.preventDefault();

        targetPopup = $(this).data('popup');

        $('.zc-lightbox').not(targetPopup).removeClass('active');
        $(targetPopup).toggleClass('active');
    });

    $('.zc-lightbox-wrapper .zc-btn-pclose, .zc-lightbox-wrapper .lightbox-footer .btn-cancel').on('click', function (e) {
        e.preventDefault();
        $(this).parents('.zc-lightbox').removeClass('active');
    });

    const skills_data = ['PHP', 'HTML', 'CSS', 'Jquery', 'Wordpress'];

    $('#key-skill-search').on('input', function () {
        const query = $(this).val().toLowerCase();

        if (query.length === 0) {
            $('#key-skill-search').closest('.sugestions-list-wrapper').hide();
            return;
        }

        const matches = skills_data.filter((item) => item.toLowerCase().indexOf(query) != -1);

        if (matches.length === 0) {
            $('#key-skill-search').closest('.sugestions-list-wrapper').hide();
            return;
        }

        let html = '';

        matches.forEach((item) => {
            html += `<div class="suggestions-list-item">${item}</div>`; // ← use backticks
        });

        $('#skills-suggestions-dropdown').html(html).show();
    });

    // search drodown filter with tag

    /*** Fetch Items via Ajax ***/
    $('#industry-search').on('focus', function () {
        fetchItems('');

        var $wrapper = $(this).closest('.zc-filter-search-dropdown');
        $wrapper.find('.filter-dropdown-wrapper').addClass('active');
    });
    $('#industry-search').on('keyup', function () {
        const search = $(this).val().trim();
        fetchItems(search);
    });
    function fetchItems(search) {
        $.ajax({
            url: 'fetch-items.php',
            method: 'post',
            data: { search },
            success: function (res) {
                $('.filter-dropdown-wrapper #industry-list').html(res);
            },
        });
    }
    $('.zc-filter-search-dropdown .search-field input').on('focus', function () {
        $('.filter-dropdown-wrapper').removeClass('active');
        $(this).closest('.search-field').next('.filter-dropdown-wrapper').addClass('active');
    });

    //$('.filter-dropdown-wrapper ul.search-list li').on('click', function(){
    $(document).on('click', '.filter-dropdown-wrapper ul.search-list li', function () {
        var value = $(this).data('value');
        var label = $(this).text();

        //find closest wrapper
        var $wrapper = $(this).closest('.zc-filter-search-dropdown');
        // Find the related .selected-items div inside this wrapper
        var $selecteditems = $wrapper.find('.selected-items');

        //skip if already selected
        if ($selecteditems.find('.tag[data-value="' + value + '"]').length > 0) return;

        $selecteditems.append('<div class="tag" data-value="' + value + '">' + label + '<i class="fa-solid fa-xmark"></i></div></div>');

        /*var tag = `<div class="tag" data-value="${value}">${label}<i class="fa-solid fa-xmark"></i></div>`;
        $selecteditems.append(tag);*/

        //blank input filed
        $wrapper.find('.search-field input').val('');
        //hide dropdown
        $wrapper.find('.filter-dropdown-wrapper').removeClass('active');
    });

    $(document).on('click', '.selected-items i', function () {
        $(this).parent('.tag').remove();
    });
    //hide on outside click
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.zc-filter-search-dropdown').length) {
            $('.filter-dropdown-wrapper').removeClass('active');
        }
        if (!$(e.target).closest('.zc-chat-user-menu .menu-toggle').length) {
            $('.zc-chat-user-menu').removeClass('active');
        }
    });

    //chat user menu
    $('.zc-chat-user-menu .menu-toggle').on('click', function () {
        $(this).closest('.zc-chat-user-menu').toggleClass('active');
    });

    // When a chat item is clicked
    $('.zc-chats-list .chats-item .chats-button').on('click', function () {
        $('.zc-chat-main').addClass('chat-open');
        $('.zc-chat-main .zc-chat-content').addClass('show');
    });
    // when chat back button is clicked
    $('.zc-chat-content .zc-chat-common-header .left .back-btn').on('click', function () {
        $('.zc-chat-main').removeClass('chat-open');
        $('.zc-chat-main .zc-chat-content').removeClass('show');
    });
});
