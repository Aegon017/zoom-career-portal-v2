// import {
//     Avatar,
//     AvatarFallback,
//     AvatarImage,
// } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//     Edit,
//     MapPin,
//     Plus,
//     Share,
// } from "lucide-react";
// import AppLayout from "@/layouts/employer-layout";
// import { Head, router } from "@inertiajs/react";
// import { BreadcrumbItem, Company, User, WorkExperience } from "@/types";
// import { useState } from "react";
// import EditBannerModal from "@/components/edit-banner-modal";
// import EditProfileModal from "@/components/edit-profile-modal";
// import WorkExperienceModal from "@/components/work-experience-modal";
// import { toast } from "sonner";
// import { format } from "date-fns";

// const breadcrumbs: BreadcrumbItem[] = [
//     { title: "Manage profile", href: "/employer/manage-profile" },
// ];

// const bannerThemes: Record<string, string> = {
//     magician: "bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500",
//     poolside: "bg-cyan-200",
//     notebook: "bg-yellow-300",
//     tangerine: "bg-orange-500",
//     sky: "bg-blue-500",
//     violet: "bg-violet-400",
//     lime: "bg-lime-300",
//     nori: "bg-green-900",
// };

// const handleShare = async () => {
//     const shareData = {
//         title: "Check out this profile",
//         text: "Here’s a great profile I wanted to share with you!",
//         url: window.location.href,
//     };

//     try {
//         if (navigator.share) {
//             await navigator.share(shareData);
//         } else {
//             await navigator.clipboard.writeText(shareData.url);
//             toast.success("Profile link copied to clipboard!");
//         }
//     } catch (err) {
//         console.error("Share failed:", err);
//     }
// };

// export default function ManageProfile({ work_experiences, companies, user }: { work_experiences: WorkExperience[], companies: Company[], user: User }) {
//     const [bannerTheme, setBannerTheme] = useState(user.banner);
//     const [showModal, setShowModal] = useState(false);
//     const [showEditProfile, setShowEditProfile] = useState(false);
//     const [showWorkModal, setShowWorkModal] = useState(false);

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Manage Profile" />

//             <div className="flex flex-1 flex-col gap-4 p-4 md:p-0">
//                 <div className="container relative">
//                     {/* Banner */}
//                     <div className="relative mb-6 overflow-hidden">
//                         <div className={`h-64 ${bannerThemes[bannerTheme || 'magician']}`} />
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             className="absolute top-8 right-8"
//                             onClick={() => setShowModal(true)}
//                         >
//                             <Edit className="w-4 h-4 mr-2" /> Edit banner
//                         </Button>
//                         <EditBannerModal
//                             open={showModal}
//                             onClose={() => setShowModal(false)}
//                             onSave={(theme) => {
//                                 setBannerTheme(theme);
//                                 router.put("/employer/profile/banner", {
//                                     banner: theme,
//                                 }, {
//                                     preserveScroll: true,
//                                     onError: () => {
//                                         toast.error('Failed to update banner');
//                                     },
//                                 });
//                             }}
//                         />
//                     </div>

//                     <Card className="md:max-w-4xl shadow-lg md:absolute md:top-52 md:left-1/2 md:transform md:-translate-x-1/2 md:w-full">
//                         <CardContent className="p-6">
//                             {/* Profile Header */}
//                             <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
//                                 <div className="md:flex gap-4">
//                                     <Avatar className="w-24 h-24 border-4 border-white shadow-md">
//                                         <a href={user.profile_image} target="_blank" rel="noopener noreferrer">
//                                             <AvatarImage src={user.profile_image} alt="ShadCN" />
//                                         </a>
//                                         <AvatarFallback className="bg-muted text-gray-600 text-xl font-semibold">
//                                             {user.name.split(' ').map(n => n[0]).join('')}
//                                         </AvatarFallback>
//                                     </Avatar>

//                                     <div className="mt-2 space-y-1">
//                                         <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
//                                             {user.name} {user.pronouns && (
//                                                 <Badge className="text-xs">{user.pronouns}</Badge>
//                                             )}
//                                         </h1>
//                                         {user.headline && (
//                                             <p className="text-muted-foreground">{user.headline}</p>
//                                         )}
//                                         <p className="text-sm text-muted-foreground">1 follower • 6 following</p>
//                                         {user.location && (
//                                             <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                                                 <MapPin className="w-4 h-4" /> {user.location}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className="flex gap-2">
//                                     <Button variant="outline" size="sm" onClick={handleShare}>
//                                         <Share className="w-4 h-4 mr-2" /> Share
//                                     </Button>
//                                     <Button size="sm" onClick={() => setShowEditProfile(true)}>Edit</Button>
//                                     <EditProfileModal
//                                         open={showEditProfile}
//                                         onClose={() => setShowEditProfile(false)}
//                                         user={user}
//                                         onSave={(data) => {
//                                             router.patch("/employer/dashboard/profile", data, {
//                                                 preserveScroll: true,
//                                                 onError: () => toast.error("Failed to update profile"),
//                                             });
//                                         }}
//                                     />
//                                 </div>
//                             </div>

//                             {/* Tabs */}
//                             <div className="border-b mb-6">
//                                 <nav className="flex gap-8 text-sm font-medium">
//                                     <button className="pb-2 border-b-2 border-primary text-primary">About</button>
//                                 </nav>
//                             </div>

//                             {/* Work Experience Section */}
//                             <ProfileSection title="Work experience" addIcon onAdd={() => setShowWorkModal(true)}>
//                                 {work_experiences.map((exp) => (
//                                     <div key={exp.id} className="flex items-start gap-4 mb-6">
//                                         {(exp.company_logo || exp.company?.company_logo) && (
//                                             <img
//                                                 src={exp.company_logo || exp.company?.company_logo}
//                                                 alt="Company Logo"
//                                                 className="h-16 w-16 rounded-md object-contain"
//                                             />
//                                         )}
//                                         <div>
//                                             <p className="font-medium">{exp.company_name || exp.company?.company_name}</p>
//                                             <p className="text-sm">{exp.title}</p>
//                                             <p className="text-sm text-muted-foreground">
//                                                 {format(new Date(exp.start_date), "dd MMM yyyy")} -{" "}
//                                                 {exp.end_date ? format(new Date(exp.end_date), "dd MMM yyyy") : "Present"}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))}

//                                 <WorkExperienceModal
//                                     open={showWorkModal}
//                                     onClose={() => setShowWorkModal(false)}
//                                     companies={companies}
//                                     onSave={async (data: Record<string, any>) => {
//                                         await router.post("/employer/profile/experience", data, {
//                                             preserveScroll: true,
//                                             onError: (errors) => {
//                                                 toast.error("Failed to add experience.");
//                                                 console.error(errors);
//                                             },
//                                         });
//                                     }}

//                                 />
//                             </ProfileSection>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }

// function ProfileSection({
//     title,
//     children,
//     editIcon = false,
//     addIcon = false,
//     onEdit,
//     onAdd,
// }: {
//     title: string;
//     children?: React.ReactNode;
//     editIcon?: boolean;
//     addIcon?: boolean;
//     onEdit?: () => void;
//     onAdd?: () => void;
// }) {
//     return (
//         <section>
//             <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold">{title}</h2>
//                 {(editIcon || addIcon) && (
//                     <Button variant="ghost" size="icon" onClick={editIcon ? onEdit : onAdd}>
//                         {editIcon ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
//                     </Button>
//                 )}
//             </div>
//             {children}
//         </section>
//     );
// }