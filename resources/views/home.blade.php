<!DOCTYPE html>
<html>

<head>
    <title>{{ config('app.name', 'Laravel') }}</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="{{ asset('favicon.png') }}">
    <meta name="description" content="ZOOMING Careers">
    <meta name="application-name" content="ZOOMING Careers" />
    <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800,800italic"
        rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600,700,800,900" rel="stylesheet"
        type="text/css">
    <link href="{{ asset('home/assets/font-awesome/css/font-awesome.min.css') }}" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="{{ asset('home/assets/bootstrap/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('home/assets/bootstrap/css/bootstrap-theme.min.css') }}">
    <link href="{{ asset('home/assets/owl-carousel/owl.carousel.css') }}" rel="stylesheet">
    <link href="{{ asset('home/assets/owl-carousel/owl.theme.css') }}" rel="stylesheet">
    <link href="{{ asset('home/assets/owl-carousel/owl.transitions.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('home/assets/css/zooming-stylesheet.css') }}">
    <script>
        (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-16208766-5', 'auto');
        ga('send', 'pageview');
    </script>
</head>

<body>
    <header>
        <div class="container">
            <nav class="navbar navbar-expand-lg navbar-default">
                <a class="navbar-brand" href="/"><img src="{{ asset('logo.png') }}" alt="Zooming Careers" /></a>
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="">Home</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                        <li><a href="/student/login">Student Portal</a></li>
                        <li><a href="/employer/login">Employer Portal</a></li>
                        <a href="http://zoomgroup.com/" class="btn btn-default btn-sm"><span
                                class="glyphicon glyphicon-education"></span> Get Trained Get Job</a>
                    </ul>
                </div>
            </nav>
        </div>
    </header>
    <div class="mainPicture">
        <div class="hero-content">
            <div class="container">
                <h2 class="main-title">Empowering Students. Enabling Employers.</h2>
                <p class="description">Zooming Career – India’s first dedicated job portal for Cybersecurity, Cloud, and
                    Networking opportunities. A unique platform connecting leading employers with our alumni in the
                    digital infrastructure space. Discover exclusive job postings and explore career growth paths in
                    Cybersecurity, Cloud, and Networking.</p>
            </div>
        </div>
        <div class="jobseeker-outer" id="jobseeker_login">
            <div class="jobseeker-login">
                <div class="col-md-12 col-sm-12">
                    <p class="js-heading">Student Portal</p>

                    <span class="js-subHeading">
                        <strong>Students registered from Jan 2025 onwards:</strong>
                        Log in using your Zoom Group credentials.<br>
                        <strong>Students enrolled before Jan 2025:</strong>
                        Use the email address you originally registered with at Zoom Technologies.
                    </span>
                    <br>
                </div>
                <div id="errJobseeker"></div>
                <form action="/remote/login" method="POST" class="navbar-form job-seeker" role="form"
                    id="login-form-jobseeker">
                    @csrf
                    <div class="form-group">
                        <div class="input-group ">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                            <input type="email" class="form-control" id="inputEmail3" name="mail"
                                placeholder="Email Address" />
                        </div>
                        <label for="inputEmail3" class="error"></label>
                    </div>
                    <div class="form-group">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                            <input type="password" class="form-control" name="password" id="inputPassword3"
                                placeholder="Password" />
                        </div>
                        <label for="inputPassword3" class="error"></label>
                    </div>
                    <div class="form-group">
                        <button type="submit" id="jobseeker-login" class="btn btn-default btn-success">Login</button>
                    </div>
                    <div class="form-group col-md-12 col-sm-12 col-md-offset-1">
                        <div class="col-md-4 col-sm-6">
                            <p class="bottom text-left"><a href="student/register">Register Here</a></p>
                        </div>
                        <div class="col-md-4 col-sm-6">
                            <p class="bottom text-left"><a href="/forgot-password">Forget the
                                    password?</a>
                            </p>
                        </div>
                    </div>
                    <p class="js-subHeading">
                        <strong>
                            Forgot your registered email? Simply click Register Here and create a new account. Access will be granted after review by our team within 3 business days.
                        </strong>
                    </p>
                </form>
            </div>
        </div>
        <div class="jobseeker-outer" id="forget_password">
            <div class="jobseeker-login">
                <div class="col-md-12 col-sm-12">
                    <span class="js-heading"> Forget Password</span>
                </div>
                <form class="navbar-form job-seeker" role="form" id="jobseeker_forget_password">
                    <div id="errForgetPass"></div>
                    <div class="form-group" style="padding:27px 0 0;">
                        <div class="input-group ">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                            <input type="email" class="form-control" id="forget_pass" name="forget_pass"
                                placeholder="Email Address" />
                        </div>
                        <label for="forget_pass" class="error"></label>
                    </div>
                    <div class="form-group" style="padding:10px 0 0;">
                        <div class="input-group">
                            <button type="submit" id="jobseeker-forgetPass"
                                class="btn btn-default btn-success">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="container top-employer-carousel">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="Corporate-Training-Main">
                        <h2 class="text-white">Top Employers</h2>
                        <div id="owl-clients" class="owl-carousel owl-theme">
                            <div class="item"><img
                                    src="{{ asset('home/assets/corporate-logos/microsoft-logo.jpg') }}"
                                    alt="">
                            </div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/cisco-logo.jpg') }}"
                                    alt="">
                            </div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/ibm-logo.jpg') }}"
                                    alt=""></div>
                            <div class="item"><img
                                    src="{{ asset('home/assets/corporate-logos/deloitte-logo.jpg') }}"
                                    alt="">
                            </div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/csc-logo.jpg') }}"
                                    alt=""></div>
                            <div class="item"><img
                                    src="{{ asset('home/assets/corporate-logos/accenture-logo.jpg') }}"
                                    alt="">
                            </div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/tata-logo.jpg') }}"
                                    alt=""></div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/oracle-logo.jpg') }}"
                                    alt="">
                            </div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/wipro-logo.jpg') }}"
                                    alt="">
                            </div>
                            <div class="item"><img
                                    src="{{ asset('home/assets/corporate-logos/infosys-logo.jpg') }}" alt="">
                            </div>
                            <div class="item"><img
                                    src="{{ asset('home/assets/corporate-logos/allianz-logo.jpg') }}" alt="">
                            </div>
                            <div class="item"><img
                                    src="{{ asset('home/assets/corporate-logos/techmahindra-logo.jpg') }}"
                                    alt=""></div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/att-logo.jpg') }}"
                                    alt=""></div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/hcl-logo.jpg') }}"
                                    alt=""></div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/bsnl-logo.jpg') }}"
                                    alt=""></div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/cnbc-logo.jpg') }}"
                                    alt=""></div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/ge-logo.jpg') }}"
                                    alt=""></div>
                            <div class="item"><img
                                    src="{{ asset('home/assets/corporate-logos/stromeshield-logo.jpg') }}"
                                    alt=""></div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/ikip-logo.jpg') }}"
                                    alt=""></div>
                            <div class="item"><img src="{{ asset('home/assets/corporate-logos/netasq-logo.jpg') }}"
                                    alt="">
                            </div>
                            <div class="item"><img
                                    src="{{ asset('home/assets/corporate-logos/zoomtech-logo.jpg') }}"
                                    alt="">
                            </div>
                            <div class="item"><img
                                    src="{{ asset('home/assets/corporate-logos/uscouncil-logo.jpg') }}"
                                    alt="">
                            </div>
                            <div class="item"><img
                                    src="{{ asset('home/assets/corporate-logos/signature-logo.jpg') }}"
                                    alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="container">
        <div class="home-aboutus">
            <div class="row">
                <div class="col-lg-7 col-md-8 col-sm-12 content-block">
                    <p>We are the only job site in India dedicated to networking, cybersecurity and cloud professionals,
                        founded way back in 2000. We are a part of the Zoom group of companies with headquarters in
                        Hyderabad, India.</p>
                    <p>Zoom Technologies is a pioneering leader in network and cybersecurity solutions. For well over 2
                        decades, Zoom has designed and built avant-garde secure networks for hundreds of clients. Zoom
                        was the first to set up an IPsec VPN in India, the first to set up a Linux based WAN (the
                        largest network in India), the first to set up a 24 X 7 antivirus and malware support center in
                        India, and of course the first to offer a comprehensive bundle of networking, cybersecurity and
                        cloud courses. The list goes on...</p>
                    <p>We train several engineers each month at our state-of-the-art training centers, along with online
                        students from 120+ countries through our online training platform. We have one of the biggest
                        databases of networking, cybersecurity and cloud professionals across the world.</p>
                    <p>We have trained over 300,000 engineers, most of them employed with several multinationals
                        worldwide.</p>
                </div>
                <div class="col-lg-5 col-md-4 col-sm-12 img-block">
                    <img src="{{ asset('home/assets/images/home-aboutus-picture.png') }}" class="mx-auto">
                </div>
            </div>
        </div>
    </div>

    <div class="Online-Training-Home vm-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-12 vision-mission-section">
                    <div class="vision-section">
                        <div class="wrapper">
                            <h1>Vision</h1>
                            <p>A comprehensive platform connecting employers with skilled professionals in
                                cybersecurity, cloud, and
                                networking. For employers, it’s the go-to destination to find top qualified talent in
                                these fields. For
                                Zoom alumni, it’s an exclusive portal designed specifically for those trained at Zoom,
                                offering tailored
                                career opportunities in cybersecurity, cloud, and networking roles.</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 vision-mission-section">
                    <div class="mission-section">
                        <div class="wrapper">
                            <h1>Mission</h1>
                            <p>Our mission is to provide a dedicated platform that connects employers with highly
                                skilled professionals
                                in cybersecurity, cloud, and networking. We aim to support Zoom alumni by offering
                                exclusive career
                                opportunities tailored to their training, while helping employers find top qualified
                                talent in these
                                fields. Through this platform, we strive to foster career growth and professional
                                development within the
                                cybersecurity, cloud, and networking sectors.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="Online-Training-Content">
                        <div class="embed-responsive embed-responsive-4by3">
                            <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/uOgQZlgFuR0"
                                frameborder="0" allowfullscreen></iframe>
                        </div>
                        <p class="text-center"><strong>Corporate Video</strong></p>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="Content">
                        <h3 class="text-uppercase">Online Training</h3>
                        <p class="text-justify">Online Training@Zoom is a cost effective method of learning new
                            networking skills from the
                            convenience of your home/workplace. Professionals need to constantly update their skill
                            portfolios to stay relevant in today's fast changing world. Taking an online training course
                            has many advantages for everyone (Fresher / Working Professional). Zoom offers online
                            training for highly coveted courses such as Cybersecurity SOC Analyst, Cybersecurity
                            Professional, Cybersecurity Expert, and Ethical Hacking, as well as CCNA, Windows Server
                            2025, Linux, VMware, Microsoft Azure, and AWS Cloud. More courses are planned for the near
                            future. Check out our full online course offerings here: <a
                                href="http://zoomgroup.com/online_course/">Online Training</a></p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Footer -->
    <div id="contact" class="footer-top">
        <h4>Contact Us At <a href="mailto:support@zoomingcareers.com">support@zoomingcareers.com</a></h4>
    </div>
    <div class="footer-copyright">
        <p>Copyright © 1996-2025 <span>Zoom Technologies (India) Private Limited</span>. All Rights Reserved.</p>
    </div>

    <!-- Bootstrap Core JavaScript -->
    <script src="{{ asset('home/assets/js/jquery/jquery-1.12.4.min.js') }}"></script>
    <script src="{{ asset('home/assets/bootstrap/js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('home/assets/owl-carousel/owl.carousel.js') }}"></script>
    <script src="{{ asset('home/assets/js/owl.js') }}"></script>
    <script src="{{ asset('home/assets/js/constant.js') }}"></script>
    <script src="{{ asset('home/assets/js/jquery/jquery.validate.min.js') }}"></script>
    <script src="{{ asset('home/assets/js/login.js') }}"></script>
</body>

</html>
