import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/jobseeker-layout';
export default function Profile() {
    const candidateData = {
        name: "Rohan Mehta",
        profileImage: '',
        designation: "IT Infrastructure Specialist",
        company: "TechNova Systems",
        updatedDate: "15 May, 2025",
        location: "Pune, INDIA",
        phone: "9823456789",
        email: "rohan.mehta@technova.com",
        experience: "8 Years 2 Months",
        noticePeriod: "Serving 2 weeks notice",
        summary: "Skilled IT Infrastructure Specialist with extensive experience in managing enterprise networks, server maintenance, and IT security compliance...",
        resume: {
            fileName: "rohanmehta_resume.pdf",
            uploadedDate: "May 18, 2025"
        },
        skills: [
            "Network Configuration & Management",
            "Server Virtualization",
            "Disaster Recovery Planning",
            "Firewall and Security Protocols",
            "Cloud Infrastructure (AWS, Azure)",
            "ITIL Process Management",
            "Hardware Troubleshooting"
        ],
        employment: [
            {
                title: "IT Infrastructure Specialist",
                company: "TechNova Systems, INDIA",
                duration: "Feb 2020 to Present",
                summary: "Leading infrastructure modernization projects, managing on-premise and cloud environments..."
            },
            {
                title: "System Administrator",
                company: "Infosync Pvt Ltd, INDIA",
                duration: "Jan 2017 to Jan 2020",
                summary: "Maintained corporate IT systems, managed internal networks and ensured cybersecurity measures..."
            }
        ],
        education: [
            {
                course: "M.Sc. in Information Technology",
                institution: "Symbiosis Institute of Computer Studies & Research",
                year: "2016",
                type: "Full Time",
                summary: "Postgraduate degree focused on advanced IT management, data systems, and cloud computing..."
            },
            {
                course: "B.Sc. in Computer Science",
                institution: "Fergusson College, Pune",
                year: "2014",
                type: "Full Time",
                summary: "Undergraduate program with focus on computer science fundamentals and programming..."
            }
        ],
        certifications: [
            {
                name: "AWS Certified Solutions Architect – Associate",
                validity: "Valid till Dec 2026"
            },
            {
                name: "CompTIA Network+",
                validity: "Valid till Jan 2027"
            }
        ],
        personalDetails: {
            gender: "Male",
            dob: "22 Aug 1993",
            address: "Model Colony, Shivajinagar, Pune - 411016, Maharashtra, India",
            maritalStatus: "Married",
            workPermit: "India",
            differentlyAbled: "No"
        },
        languages: [
            {
                name: "English",
                proficiency: "Proficient",
                read: true,
                write: true,
                speak: true
            },
            {
                name: "Hindi",
                proficiency: "Fluent",
                read: true,
                write: true,
                speak: true
            },
            {
                name: "Marathi",
                proficiency: "Conversational",
                read: true,
                write: false,
                speak: true
            }
        ],
        followers: 5,
        following: 25
    };


    const [activePopup, setActivePopup] = useState("");
    const handleOpen = (popup: string, e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setActivePopup((prevPopup) => (prevPopup === popup ? "" : popup));
    };
    const handleClose = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
        e.preventDefault();
        setActivePopup("");
    };

    return (
        <AppLayout>
            <Head title="Explore" />
            <div className="zc-main-wrapper py-4">
                <div className="zc-candidate-profile-wrapper">
                    <div className="zc-container">
                        <div className="zc-candidate-profile-header mb-3">
                            <div className="top-cover"></div>
                            <div className="candidate-basic-details d-block d-sm-flex">
                                <div className="candidate-image p-3">
                                    <img src={candidateData.profileImage} alt="Profile" />
                                </div>
                                <div className="candidate-info p-3">
                                    <div className="zc-row d-block d-md-flex justify-content-between bb-style-2 pb-3">
                                        <div className="left-col mb-2 mb-md-0">
                                            <div className="name">
                                                <h2>{candidateData.name}</h2>
                                                <a href="#" className="zc-btn-edit" id="cb-edit">
                                                    <i className="fa-solid fa-pencil"></i>
                                                </a>
                                            </div>
                                            <div className="d-block">
                                                <div className="current-emp-info">
                                                    <h4 className="designation">{candidateData.designation}</h4>
                                                    <p className="company-name">at {candidateData.company}</p>
                                                </div>
                                                <div className="profile-updated-date">
                                                    Profile last updated - <span className="date">{candidateData.updatedDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="right-col follower-block d-flex align-items-start gap-2">
                                            <div className="icon-text">
                                                <a href="#"><span>{candidateData.followers}</span> followers</a>
                                            </div>
                                            <div className="icon-text">
                                                <a href="#"><span>{candidateData.following}</span> following</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="other-details">
                                        <ul>
                                            <li><i className="fa-solid fa-location-dot"></i>{candidateData.location}</li>
                                            <li><i className="fa-solid fa-phone"></i>{candidateData.phone}</li>
                                            <li><i className="fa-solid fa-envelope"></i>{candidateData.email}</li>
                                            <li><i className="fa-solid fa-briefcase"></i>{candidateData.experience}</li>
                                            <li><i className="fa-solid fa-calendar-days"></i>{candidateData.noticePeriod}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="zc-profile-summary zc-card-style-2 mb-3">
                            <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                                <h3 className="mb-0">Summary</h3>
                                <a href="#" onClick={(e) => handleOpen('profile-summary-popup', e)} id="zc-edit-candidate-summary" data-popup="#profile-summary-popup" className="zc-open-lightbox zc-btn-edit">
                                    <i className="fa-solid fa-pencil"></i>
                                </a>
                                <a href="#" id="zc-add-candidate-summary" className="zc-btn-add d-none">
                                    <i className="fa-solid fa-plus"></i>
                                </a>
                            </div>
                            <div className="zc-card-content">
                                {candidateData.summary}
                            </div>
                        </div>
                        <div className="zc-candidate-profile-resume zc-card-style-2 mb-3">
                            <div className="zc-card-header">
                                <div className="text">
                                    <h3>Resume</h3>
                                </div>
                            </div>
                            <div className="zc-card-content">
                                <div className="zc-resume-list-item d-block d-sm-flex justify-content-between align-items-center mb-2">
                                    <div className="left mb-2">
                                        <h4 className="file-name">{candidateData.resume.fileName}</h4>
                                        <p className="updated-date mb-0">{candidateData.resume.uploadedDate}</p>
                                        <div id="statusMsg"></div>
                                    </div>
                                    <div className="right mb-2">
                                        <a href="#">
                                            <i className="fa-solid fa-download"></i>
                                        </a>
                                        <a href="#">
                                            <i className="fa-regular fa-trash-can"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="zc-resume-upload-wrapper">
                                    <input type="file" name="resume-file" id="resume-file" />
                                    <div id="progess-container">
                                        <div id="progress-bar"></div>
                                    </div>
                                    <button id="btn-upload">Update Resume</button>
                                    <p className="instruction mb-0">Supported Formats: doc, docx, rtf, pdf, upto 2 MB</p>
                                </div>
                            </div>
                        </div>
                        <div className="zc-profile-skills zc-card-style-2 mb-3">
                            <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                                <h3 className="mb-0">Skills</h3>
                                <a href='#' onClick={(e) => handleOpen('profile-keyskills-popup', e)} id="zc-edit-candidate-skillls" data-popup="#profile-keyskills-popup" className="zc-open-lightbox zc-btn-edit">
                                    <i className="fa-solid fa-pencil"></i>
                                </a>
                                <a href='#' onClick={(e) => handleOpen('profile-keyskills-popup', e)} id="zc-add-candidate-skills" className="zc-btn-add d-none">
                                    <i className="fa-solid fa-plus"></i>
                                </a>
                            </div>
                            <div className="zc-card-content">
                                <ul className="zc-skills-list">
                                    {candidateData.skills.map((skill, idx) => (
                                        <li key={idx}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="zc-profile-employment zc-card-style-2 mb-3">
                            <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                                <h3 className="mb-0">Employment</h3>
                                <a href="#" id="zc-add-candidate-employment" className="zc-btn-add">
                                    <i className="fa-solid fa-plus"></i>
                                </a>
                            </div>
                            <div className="zc-card-content">
                                <div className="employment-list">
                                    {candidateData.employment.map((job, index) => (
                                        <div className="employment-list-item" key={index}>
                                            <div className="icon-text">
                                                <h3 className="job-title">{job.title}</h3>
                                                <a href="#" id="zc-edit-candidate-employment" className="zc-btn-edit">
                                                    <i className="fa-solid fa-pencil"></i>
                                                </a>
                                            </div>
                                            <h4 className="company-name-location">{job.company}</h4>
                                            <div className="duration">{job.duration}</div>
                                            <div className="job-summary">
                                                {job.summary}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="zc-profile-education zc-card-style-2 mb-3">
                            <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                                <h3 className="mb-0">Education</h3>
                                <a href="#" id="zc-add-candidate-education" className="zc-btn-add">
                                    <i className="fa-solid fa-plus"></i>
                                </a>
                            </div>
                            <div className="zc-card-content">
                                <div className="education-list">
                                    {candidateData.education.map((edu, idx) => (
                                        <div className="education-list-item" key={idx}>
                                            <div className="icon-text">
                                                <h3 className="education-course-title">{edu.course}</h3>
                                                <a href="#" id="zc-edit-candidate-education" className="zc-btn-edit">
                                                    <i className="fa-solid fa-pencil"></i>
                                                </a>
                                            </div>
                                            <h4 className="education-university-college">{edu.institution}</h4>
                                            <div className="course-type-year d-flex align-items-center gap-1 mb-2">
                                                <span className="year">{edu.year}</span>
                                                <span className="divider"></span>
                                                <span className="course-type">{edu.type}</span>
                                            </div>
                                            <div className="course-summary">
                                                {edu.summary}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="zc-profile-certification zc-card-style-2 mb-3">
                            <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                                <div className="text">
                                    <h3 className="mb-0">Certification</h3>
                                    <p className="mb-0">Add details of certifications you have completed</p>
                                </div>
                                <a href="#" id="zc-add-candidate-certificate" className="zc-btn-add">
                                    <i className="fa-solid fa-plus"></i>
                                </a>
                            </div>
                            {
                                candidateData.certifications.map((certificate, key) => (
                                    <div className="zc-card-content" key={key}>
                                        <div className="certificate-list">
                                            <div className="certificate-list-item d-flex align-items-start gap-2">
                                                <div className="icon">
                                                    <svg fill="#000000" width="40" height="40" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H19l.57-.7.93-1.14L20.41,28H4V8H32l0,8.56a8.41,8.41,0,0,1,2,1.81V8A2,2,0,0,0,32,6Z" className="clr-i-outline clr-i-outline-path-1"></path>
                                                        <rect x="7" y="12" width="17" height="1.6" className="clr-i-outline clr-i-outline-path-2"></rect>
                                                        <rect x="7" y="16" width="11" height="1.6" className="clr-i-outline clr-i-outline-path-3"></rect>
                                                        <rect x="7" y="23" width="10" height="1.6" className="clr-i-outline clr-i-outline-path-4"></rect>
                                                        <path d="M27.46,17.23a6.36,6.36,0,0,0-4.4,11l-1.94,2.37.9,3.61,3.66-4.46a6.26,6.26,0,0,0,3.55,0l3.66,4.46.9-3.61-1.94-2.37a6.36,6.36,0,0,0-4.4-11Zm0,10.68a4.31,4.31,0,1,1,4.37-4.31A4.35,4.35,0,0,1,27.46,27.91Z" className="clr-i-outline clr-i-outline-path-5"></path>
                                                    </svg>
                                                </div>
                                                <div className="info">
                                                    <div className="title d-flex gap-2 align-items-center">
                                                        <h3 className="certificate-name m-0">{certificate.name}</h3>
                                                        <a href="#" id="zc-edit-candidate-certificate" className="zc-btn-edit">
                                                            <i className="fa-solid fa-pencil"></i>
                                                        </a>
                                                    </div>
                                                    <div className="certificate-validity">
                                                        Validity: {certificate.validity}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="zc-profile-personal-details zc-card-style-2 mb-3">
                            <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                                <div className="text">
                                    <h3 className="mb-0">Personal Details</h3>
                                </div>
                                <a href="#" id="zc-edit-candidate-pdetails" className="zc-btn-edit">
                                    <i className="fa-solid fa-pencil"></i>
                                </a>
                            </div>
                            <div className="zc-card-content">
                                <div className="row candidate-personal-details">
                                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                        <div className="title">Gender</div>
                                        <div className="value">{candidateData.personalDetails.gender}</div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                        <div className="title">Date Of Birth</div>
                                        <div className="value">{candidateData.personalDetails.dob}</div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                        <div className="title">Address</div>
                                        <div className="value">{candidateData.personalDetails.address}</div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                        <div className="title">Marital Status</div>
                                        <div className="value">{candidateData.personalDetails.maritalStatus}</div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                        <div className="title">Work Permit</div>
                                        <div className="value">{candidateData.personalDetails.workPermit}</div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                        <div className="title">Differently Abled</div>
                                        <div className="value">{candidateData.personalDetails.differentlyAbled}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="zc-profile-candidate-languages zc-card-style-2 mb-3">
                            <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                                <div className="text">
                                    <h3 className="mb-0">Languages</h3>
                                </div>
                                <a href="#" id="zc-edit-candidate-languages" className="zc-btn-edit">
                                    <i className="fa-solid fa-pencil"></i>
                                </a>
                            </div>
                            <div className="zc-card-content">
                                <div className="language-list">
                                    {candidateData.languages.map((lang, idx) => (
                                        <div className="language-list-item" key={idx}>
                                            <div className="row top">
                                                <div className="col-6 mb-2">
                                                    <div className="title">Language</div>
                                                    <div className="content">{lang.name}</div>
                                                </div>
                                                <div className="col-6 mb-2">
                                                    <div className="title">Proficiency</div>
                                                    <div className="content">{lang.proficiency}</div>
                                                </div>
                                            </div>
                                            <div className="bottom">
                                                <ul>
                                                    <ul>
                                                        <li><i className={`fa-solid ${lang.read ? "fa-check" : "fa-xmark"}`}></i>Read</li>
                                                        <li><i className={`fa-solid ${lang.write ? "fa-check" : "fa-xmark"}`}></i>Write</li>
                                                        <li><i className={`fa-solid ${lang.speak ? "fa-check" : "fa-xmark"}`}></i>Speak</li>
                                                    </ul>
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="profile-summary-popup"
                className={`zc-lightbox prfile-summary-lightbox ${activePopup === 'profile-summary-popup' ? 'active' : ''}`}>
                <div className="zc-lightbox-wrapper">
                    <div className="zc-btn-pclose" onClick={(e) => handleClose(e)}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                            <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                        </svg>
                    </div>
                    <div className="inner-wrapper">
                        <form action="#">
                            <div className="lightbox-header">
                                <div className="title-and-btn">
                                    <h4>Profile Summary</h4>
                                    <a href="#"><i className="fa-regular fa-trash-can"></i></a>
                                </div>
                                <p className="mb-0">Give recruiters a brief overview of the highlights of your career, key achievements, and career goals to help recruiters know your profile better.</p>
                            </div>
                            <div className="lightbox-content py-3">
                                <textarea id="candidate-profile-summary" value={"Experienced Leasing Property Manager with strong skills in tenant relations, lease administration, and property marketing. Proven ability to maximize occupancy, handle maintenance coordination, and ensure smooth day-to-day operations."}></textarea>
                            </div>
                            <div className="lightbox-footer">
                                <a href="#" className="btn-cancel" onClick={(e) => handleClose(e)}>Cancel</a>
                                <button>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`zc-lightbox profile-keyskill-lightbox ${activePopup === 'profile-keyskills-popup' ? 'active' : ''}`} id="profile-keyskills-popup">
                <div className="zc-lightbox-wrapper">
                    <div className="zc-btn-pclose" onClick={(e) => handleClose(e)}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                            <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                        </svg>
                    </div>
                    <div className="inner-wrapper">
                        <form action="#">
                            <div className="lightbox-header">
                                <div className="title-and-btn">
                                    <h4>Key Skills</h4>
                                    <a href="#"><i className="fa-regular fa-trash-can"></i></a>
                                </div>
                                <p className="mb-0">Add skills that best define your expertise,</p>
                            </div>
                            <div className="lightbox-content py-3">
                                <div className="added-skills-wrapper">
                                    <h4>Skills</h4>
                                    <ul className="added-skills mb-4">
                                        <li className="skill-item">
                                            <span className="txt">Lease Negotiation & Administration</span>
                                            <a href="#">x</a>
                                        </li>
                                        <li className="skill-item">
                                            <span className="txt">Conflict Resolution</span>
                                            <a href="#">x</a>
                                        </li>
                                        <li className="skill-item">
                                            <span className="txt">Property Inspections</span>
                                            <a href="#">x</a>
                                        </li>
                                        <li className="skill-item">
                                            <span className="txt">Maintenance Coordination</span>
                                            <a href="#">x</a>
                                        </li>
                                        <li className="skill-item">
                                            <span className="txt">Reporting & Documentation</span>
                                            <a href="#">x</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="zc-search-dropdown-wrapper">
                                    <input type="text" id="key-skill-search" className="search-field" placeholder="Add Skills" />
                                    <div id="skills-suggestions-dropdown" className="sugestions-list-wrapper">
                                        <div className="suggestions-list-item">PHP</div>
                                        <div className="suggestions-list-item">HTML</div>
                                        <div className="suggestions-list-item">CSS</div>
                                        <div className="suggestions-list-item">Jquery</div>
                                        <div className="suggestions-list-item">Wordpress</div>
                                    </div>
                                </div>
                            </div>
                            <div className="lightbox-footer">
                                <a href="#" className="btn-cancel" onClick={handleClose}>Cancel</a>
                                <button>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout >
    );
}