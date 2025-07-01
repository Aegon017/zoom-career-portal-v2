import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles } from "lucide-react"
import { Link } from "@inertiajs/react"

export default function HomePage() {
    const [ scrollY, setScrollY ] = useState( 0 )
    const [ isVisible, setIsVisible ] = useState( false )

    useEffect( () => {
        const handleScroll = () => setScrollY( window.scrollY )
        window.addEventListener( "scroll", handleScroll )
        setIsVisible( true )
        return () => window.removeEventListener( "scroll", handleScroll )
    }, [] )

    return (
        <div className="min-h-screen hero-gradient-bg text-foreground overflow-hidden relative">
            <div className="fixed inset-0 bg-pattern-dots opacity-40 pointer-events-none" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-animated-primary rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-animated-secondary rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
                <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-animated-accent rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
            </div>

            <nav className="fixed top-0 w-full z-50 glass-effect">
                <div className="container-padding flex justify-between items-center py-4">
                    <Link href="#" className="flex items-center gap-2 focus-ring rounded-lg">
                        <img src="/logo.png" alt="Zooming Career Logo" className="h-12 w-auto" />
                    </Link>
                </div>
            </nav>

            <section className="relative min-h-screen flex items-center justify-center pt-12">
                <div
                    className="absolute inset-0 opacity-30 transition-transform duration-1000"
                    style={ {
                        transform: `translateY(${ scrollY * 0.5 }px)`,
                        backgroundImage: `
                            radial-gradient(circle at 25% 25%, color-mix(in srgb, var(--primary) 15%, transparent) 0%, transparent 50%), 
                            radial-gradient(circle at 75% 75%, color-mix(in srgb, var(--secondary) 15%, transparent) 0%, transparent 50%)
                        `,
                    } }
                />

                <div
                    className={ `relative z-10 container-padding text-center transition-all duration-1000 ${ isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }` }
                >
                    <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2 shadow-lg animate-fade-in">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Next-Gen Career Platform
                    </Badge>

                    <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-balance animate-fade-in-up delay-200">
                        <span className="text-gradient-hero">Unlock Opportunities</span>
                        <br />
                        <span className="text-foreground/80">for Tomorrow</span>
                    </h1>

                    <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 text-muted-foreground leading-relaxed text-balance animate-fade-in-up delay-300">
                        Discover your next opportunity with a modern career platform designed for students and employers.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-500">
                        <Link
                            href="/login"
                            className="group bg-primary text-primary-foreground px-6 py-2 rounded-full text-lg font-semibold glow-hover transition-all duration-300 hover-lift focus-ring flex items-center gap-2 shadow-lg"
                        >
                            Employer Portal
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/login"
                            className="group bg-white/80 text-secondary hover:bg-secondary hover:text-secondary-foreground px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 hover-lift backdrop-blur-md focus-ring flex items-center gap-2 shadow-lg"
                        >
                            Student Portal
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-0 z-0">
                    <div className="absolute top-16 left-12 w-16 h-16 bg-primary/70 rounded-xl  animate-float blur-[2px]" />
                    <div className="absolute top-24 right-16 w-12 h-12 bg-secondary/60 rounded-full animate-float-delay blur-[2px]" />
                    <div className="absolute bottom-16 right-10 w-24 h-8 bg-accent/90 rounded-full animate-float-slow blur-[2px]" />
                    <div className="absolute bottom-20 left-8 w-16 h-12 bg-primary/50 rounded-3xl  animate-float blur-[2px]" />
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-10 h-10 bg-muted/60 rounded-lg animate-float-delay blur-[2px]" />
                    <div className="absolute top-1/3 right-0 transform -translate-y-1/2 w-14 h-14 bg-secondary/60 rotate-45 rounded-lg animate-float-slow blur-[2px]" />
                </div>
            </section>

            <footer className="relative py-4 border-t border-border glass-effect">
                <div className="flex items-center gap-3 text-muted-foreground justify-center">
                    <span>&copy; 2025 Zooming Career.</span>
                </div>
            </footer>

            <style>
                { `
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    50% { transform: translateY(-10px) rotate(2deg) scale(1.05); }
                }

                @keyframes float-delay {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    50% { transform: translateY(-12px) rotate(-1deg) scale(1.1); }
                }

                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    50% { transform: translateY(-8px) rotate(1deg) scale(1.03); }
                }

                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-float {
                    animation: float 7s ease-in-out infinite;
                }

                .animate-float-delay {
                    animation: float-delay 9s ease-in-out infinite;
                }

                .animate-float-slow {
                    animation: float-slow 11s ease-in-out infinite;
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
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
            `}
            </style>
        </div>
    )
}
