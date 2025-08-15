<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zooming Careers</title>
    <link rel="shortcut icon" href="{{ asset('favicon.png') }}" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" />
    <link rel="stylesheet" href="{{ asset('assets/style.css') }}">
</head>

<body>
    <header class="main-header">
        <div class="container">
            <div class="header-wrapper">
                <div class="logo">
                    <a href="#">
                        <img src="{{ asset('logo.png') }}" alt="Zooming Careers">
                    </a>
                </div>
                <div class="button-group">
                    <a href="/employer/login" class="btn-1">
                        Employer Portal
                        <span><i class="fa-solid fa-user-tie"></i></span>
                    </a>
                    <a href="/student/login" class="btn-1 style2">
                        Student Portal
                        <span><i class="fa-solid fa-user-check"></i></span>
                    </a>
                </div>
            </div>
        </div>
    </header>
    <div class="hero-section">
        <div class="container">
            <div class="hero-content">
                <h4 class="sub-title"><span class="txt-primary">Empowering Students.</span> <span
                        class="txt-secondary">Enabling Employers.</span></h4>
                <h1 class="main-title">Defend the Digital World – Build Your Career</h1>
                <p class="description">Zooming Career - Our specialized job portal brings together ambitious students,
                    skilled professionals, and leading employers in the digital infrastructure space. Explore tailored
                    job postings, and career paths in cybersecurity, cloud, and networking.</p>
                <div class="button-group">
                    <a href="/employer/login" class="btn-1">
                        Employer Portal
                        <span><i class="fa-solid fa-user-tie"></i></span>
                    </a>
                    <a href="/student/login" class="btn-1 style2">
                        Student Portal
                        <span><i class="fa-solid fa-user-check"></i></span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="vision-mission-section">
        <div class="vision-section">
            <div class="wrapper">
                <h1>Vision</h1>
                <p>A comprehensive platform connecting employers with skilled professionals in cybersecurity, cloud, and
                    networking. For employers, it’s the go-to destination to find top qualified talent in these fields.
                    For Zoom alumni, it’s an exclusive portal designed specifically for those trained at Zoom, offering
                    tailored career opportunities in cybersecurity, cloud, and networking roles.</p>
            </div>
        </div>
        <div class="mission-section">
            <div class="wrapper">
                <h1>Mission</h1>
                <p>Our mission is to provide a dedicated platform that connects employers with highly skilled
                    professionals in cybersecurity, cloud, and networking. We aim to support Zoom alumni by offering
                    exclusive career opportunities tailored to their training, while helping employers find top
                    qualified talent in these fields. Through this platform, we strive to foster career growth and
                    professional development within the cybersecurity, cloud, and networking sectors.</p>
            </div>
        </div>
    </div>
    <div class="footer-top">
        <h4>Contact Us At <a href="mailto:support@zoomingcareer.com">support@zoomingcareer.com</a></h4>
    </div>
    <div class="footer-copyright">
        <p>Copyright © 1996-2025 <span>Zoom Technologies (India) Private Limited</span>. All Rights Reserved.</p>
    </div>
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
    integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="{{ asset('assets/script.js') }}"></script>

</html>
