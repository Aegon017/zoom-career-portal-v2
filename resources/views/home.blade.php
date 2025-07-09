<?php

declare(strict_types=1);

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Zooming Career</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" />
    <style>
        :root {
            --main-orange: #ff5522;
            --secondary-blue: #0055a5;
        }

        .bg-main {
            background-color: var(--main-orange) !important;
        }

        .text-main {
            color: var(--main-orange) !important;
        }

        .border-main {
            border-color: var(--main-orange) !important;
        }

        .bg-main-light {
            background-color: rgba(255, 85, 34, 0.1) !important;
        }

        .btn-main,
        .btn-outline-main {
            border-radius: 5rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }

        .btn-main {
            background-color: var(--main-orange);
            color: #fff;
            border: none;
        }

        .btn-main:hover {
            background-color: var(--main-orange);
            color: #fff;
            border: 1px solid var(--main-orange);
        }

        .btn-outline-main {
            border: 1px solid var(--secondary-blue);
            color: var(--secondary-blue);
        }

        .btn-outline-main:hover {
            background-color: var(--secondary-blue);
            color: #fff;
        }

        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate-fade-in-up {
            animation: fade-in-up 1s ease-out forwards;
        }

        .delay-200 {
            animation-delay: 0.2s;
        }

        .delay-300 {
            animation-delay: 0.3s;
        }

        .delay-500 {
            animation-delay: 0.5s;
        }
    </style>
</head>

<body>
    <div class="min-vh-100 position-relative overflow-hidden text-dark">
        <nav class="position-fixed top-0 w-100 bg-light bg-opacity-75 backdrop-blur z-3 shadow-sm py-3 px-4">
            <div class="container d-flex justify-content-between align-items-center">
                <a href="{{ route('home') }}" class="text-decoration-none">
                    <img src="/logo.png" alt="Zooming Career Logo" class="img-fluid" style="height: 48px;">
                </a>
            </div>
        </nav>

        <section class="position-relative min-vh-100 d-flex align-items-center justify-content-center pt-5">
            <div class="container text-center">
                <div
                    class="d-inline-flex align-items-center mb-4 px-3 py-2 border border-main rounded-pill bg-main-light text-main shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" class="me-2" width="20" height="20" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 4v2M5 10v2M5 16v2M12 4v2M12 10v2M12 16v2M19 4v2M19 10v2M19 16v2" />
                    </svg>
                    Next-Gen Career Platform
                </div>

                <h1 class="display-4 fw-bold mb-4 animate-fade-in-up delay-200">
                    <span class="text-main">Unlock Opportunities</span><br>
                    <span class="text-muted">for Tomorrow</span>
                </h1>

                <p class="lead text-muted mb-5 animate-fade-in-up delay-300">
                    Discover your next opportunity with a modern career platform designed for students and employers.
                </p>

                <div
                    class="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center animate-fade-in-up delay-500">
                    <a href="{{ route('employer.login') }}"
                        class="btn btn-main btn-lg d-flex align-items-center gap-2 shadow">
                        Employer Portal
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>

                    <a href="{{ route('student.login') }}"
                        class="btn btn-outline-main btn-lg d-flex align-items-center gap-2 shadow">
                        Student Portal
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>

        <footer class="bg-white border-top py-3 text-center">
            <div class="text-muted">&copy; 2025 Zooming Career.</div>
        </footer>
    </div>
</body>

</html>
