import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Briefcase, Building, ExternalLink, GraduationCap, MapPin, Users } from "lucide-react";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employers',
        href: route('employers.index'),
    },
    {
        title: 'Profile',
        href: '',
    },
];

export default function CompanyProfilePage() {
    const testimonials = [
        {
            id: 1,
            content: "Following his work in college, Andrew is involved with first-generation, low-income initiatives and racial/ethnic employee resource groups and networks. He has found a strong mentorship and sponsorship culture at OW, making him feel at home.",
            author: {
                name: "Andrew Perez",
                role: "Consultant",
                avatar: "AP",
                education: {
                    field: "Sociology",
                    year: "2020",
                    institution: "Harvard University"
                }
            }
        },
        {
            id: 2,
            content: "When I recruited for consulting, Oliver Wyman stood out as a place where my growth would be prioritized. With each project comes new challenges, responsibilities, and opportunities to effect lasting and important change for our clients.",
            author: {
                name: "Alex Coletta",
                role: "Senior Consultant",
                avatar: "AC",
                education: {
                    field: "International Studies",
                    year: "2018",
                    institution: "The University of Michigan"
                }
            }
        }
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employer" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="min-h-screen bg-background">
                    <main className="w-full">
                        <div className="w-full">
                            {/* Banner */}
                            <div className="w-full h-full relative bg-gradient-to-r from-primary/5 to-primary/10">
                                <img className="h-auto" src="https://static.vecteezy.com/system/resources/previews/000/701/690/non_2x/abstract-polygonal-banner-background-vector.jpg" alt="" />
                            </div>

                            {/* Profile Card */}
                            <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative pt-8 md:pt-0 md:-mt-20">
                                <div className="bg-background rounded-lg p-6 md:p-8 border shadow-sm">
                                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                        <Avatar className="w-20 h-20 border-4 border-background">
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-xl font-semibold text-primary">OW</span>
                                            </div>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                    <h2 className="text-2xl font-semibold">Oliver Wyman</h2>
                                                    <p className="text-muted-foreground">Management Consulting</p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm text-muted-foreground">9.48K followers</span>
                                                    <Button variant="outline" size="sm">Follow</Button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>New York City, NY</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>1,000-5,000 employees</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <ExternalLink className="h-4 w-4" />
                                                    <a
                                                        href="https://www.oliverwyman.com"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        www.oliverwyman.com
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
                            <Tabs defaultValue="overview" className="mt-8">
                                <TabsList className="w-full justify-start space-x-8 border-b bg-transparent p-0 h-auto">
                                    <TabsTrigger
                                        value="overview"
                                        className="relative px-1 pb-3 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent rounded-none border-0 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
                                    >
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="jobs"
                                        className="relative px-1 pb-3 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent rounded-none border-0 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
                                    >
                                        Jobs
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-8 space-y-12 pb-12">
                                    <section className="py-6">
                                        <h2 className="text-2xl font-semibold mb-6">Overview</h2>
                                        <div className="space-y-4 text-base">
                                            <p>
                                                Oliver Wyman is a global leader in management consulting. With offices in more than 70
                                                cities across 30 countries, Oliver Wyman combines deep industry knowledge with
                                                specialized expertise in strategy, operations, risk management, and organization
                                                transformation.
                                            </p>
                                            <p>
                                                Oliver Wyman is a business of Marsh McLennan [NYSE: MMC]. For more
                                                information, visit{" "}
                                                <a
                                                    href="https://www.oliverwyman.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline inline-flex items-center"
                                                >
                                                    www.oliverwyman.com
                                                    <ExternalLink className="h-3.5 w-3.5 ml-0.5" />
                                                </a>.
                                            </p>
                                        </div>
                                    </section>
                                    <section className="py-6">
                                        <h2 className="text-2xl font-semibold mb-6">Work life</h2>
                                        <div className="space-y-4 text-base">
                                            <p>
                                                At Oliver Wyman, we celebrate entrepreneurialism and difference in all its forms. This
                                                means having common values to guide us in key. These shared values represent who we are
                                                and who we want to be. They help bring us together to create breakthroughs and achieve
                                                the amazing. We believe that our culture is the sum total of each of our actions. Together
                                                we are Oliver Wyman.
                                            </p>
                                        </div>
                                    </section>
                                    <section className="py-6">
                                        <h2 className="text-2xl font-semibold mb-8">What Our People Say</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {testimonials.map((testimonial) => (
                                                <Card key={testimonial.id} className="bg-background border shadow-sm hover:shadow transition-shadow duration-200">
                                                    <CardHeader className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-10 w-10 bg-primary/10">
                                                                <span className="text-primary text-sm">{testimonial.author.avatar}</span>
                                                            </Avatar>
                                                            <div>
                                                                <h3 className="font-medium">{testimonial.author.name}</h3>
                                                                <p className="text-sm text-muted-foreground">{testimonial.author.role}</p>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm leading-relaxed text-muted-foreground">{testimonial.content}</p>
                                                    </CardContent>
                                                    <CardFooter className="flex flex-col items-start gap-1.5 border-t pt-4">
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <GraduationCap className="h-3.5 w-3.5" />
                                                            <span>{testimonial.author.education.field} · {testimonial.author.education.year}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Building className="h-3.5 w-3.5" />
                                                            <span>{testimonial.author.education.institution}</span>
                                                        </div>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    </section>
                                    <section className="py-6">
                                        {/* {<h2 className="text-2xl font-semibold mb-6">Jobs</h2>} */}

                                        <div className="bg-muted/30 rounded-lg p-8 text-center">
                                            <p className="text-muted-foreground mb-4">No jobs right now, but check back later</p>
                                            <Button variant="outline">Set job alert</Button>
                                        </div>
                                    </section>
                                </TabsContent>

                                <TabsContent value="jobs" className="mt-8">
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}