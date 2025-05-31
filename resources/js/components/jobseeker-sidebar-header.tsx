import logo from '../assets/images/logo.png'

export function AppSidebarHeader() {
    return (
        <div className="zc-main-top-nav">
            <a href="#" className="zc-sidebar-toggle" id="zc-sidebar-toggle">
                <i className="fa-solid fa-bars"></i>
            </a>
            <a href="#" className="brand-logo"><img src={logo} alt="Zoom Career" /></a>
            <ul className="zc-top-nav-bar">
                <li className="zc-nav-item zc-dropdown user-notification">
                    <a href="#" className="zc-dropdown-btn">
                        <div className="nicon-box">
                            <i className="fa-regular fa-bell"></i>
                            <span className="indicator">4</span>
                        </div>
                    </a>
                    <div className="zc-dropdown-menu">
                        <div className="zc-dropdown-menu-header">4 New Notifications</div>
                        <div className="list-group">
                            <a href="#" className="list-group-item">
                                <div className="row g-0 align-items-center">
                                    <div className="col-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-circle text-danger">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                    </div>
                                    <div className="col-10">
                                        <div className="text-dark">Update completed</div>
                                        <div className="text-muted small mt-1">Restart server 12 to complete the update.</div>
                                        <div className="text-muted small mt-1">30m ago</div>
                                    </div>
                                </div>
                            </a>
                            <a href="#" className="list-group-item">
                                <div className="row g-0 align-items-center">
                                    <div className="col-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell text-warning">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                        </svg>
                                    </div>
                                    <div className="col-10">
                                        <div className="text-dark">Lorem ipsum</div>
                                        <div className="text-muted small mt-1">Aliquam ex eros, imperdiet vulputate hendrerit et.</div>
                                        <div className="text-muted small mt-1">2h ago</div>
                                    </div>
                                </div>
                            </a>
                            <a href="#" className="list-group-item">
                                <div className="row g-0 align-items-center">
                                    <div className="col-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home text-primary">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                        </svg>
                                    </div>
                                    <div className="col-10">
                                        <div className="text-dark">Login from 192.186.1.8</div>
                                        <div className="text-muted small mt-1">5h ago</div>
                                    </div>
                                </div>
                            </a>
                            <a href="#" className="list-group-item">
                                <div className="row g-0 align-items-center">
                                    <div className="col-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-plus text-success">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="8.5" cy="7" r="4"></circle>
                                            <line x1="20" y1="8" x2="20" y2="14"></line>
                                            <line x1="23" y1="11" x2="17" y2="11"></line>
                                        </svg>
                                    </div>
                                    <div className="col-10">
                                        <div className="text-dark">New connection</div>
                                        <div className="text-muted small mt-1">Christina accepted your request.</div>
                                        <div className="text-muted small mt-1">14h ago</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="zc-dropdown-menu-footer">
                            <a href="#" className="text-muted">Show all notifications</a>
                        </div>
                    </div>
                </li>
                <li className="zc-nav-item zc-dropdown user-nav">
                    <a href="#" className="zc-dropdown-btn">
                        {/* <img src={avatar} /> */}
                    </a>
                    <div className="zc-dropdown-menu">
                        <a href="#" className="zc-dropdown-item">
                            <i className="fas fa-user"></i>
                            Profile
                        </a>
                        <a href="#" className="zc-dropdown-item">
                            <i className="fas fa-user"></i>
                            My Jobs
                        </a>
                        <a href="#" className="zc-dropdown-item">
                            <i className="fas fa-user"></i>
                            My Documents
                        </a>
                        <a href="#" className="zc-dropdown-item">
                            <i className="fas fa-user"></i>
                            My Career Interests
                        </a>
                    </div>
                </li>
            </ul>
        </div>
    );
}
