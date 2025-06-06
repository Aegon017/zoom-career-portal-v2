import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppLayout from "@/layouts/employer-layout"
import { BreadcrumbItem, Message } from "@/types"
import { Head } from "@inertiajs/react"
import { Send } from "lucide-react"
import { useState } from "react"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Inbox", href: "/employer/inbox" }
]

interface MessagesListingProps {
    messages: Message[]
}

const MessagesListing = ({ messages }: MessagesListingProps) => {
    const [activeTab, setActiveTab] = useState("all")

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inbox" />
            <div className="flex h-[87dvh] flex-row gap-4 rounded-xl p-4 md:p-0">
                <div className="w-96 border-r flex flex-col">
                    <div className="p-4 border-b">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
                                <TabsTrigger value="unread" className="text-sm">Unread</TabsTrigger>
                                <TabsTrigger value="archived" className="text-sm">Archived</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`p-4 border-b cursor-pointer hover:bg-muted/40 transition-colors`}
                            >
                                <div className="flex items-start space-x-3">
                                    <Avatar className="h-10 w-10 flex-shrink-0">
                                        {message.avatar ? (
                                            <AvatarImage src={message.avatar} alt={message.name} />
                                        ) : null}
                                        <AvatarFallback>{message.initials}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`text-sm truncate ${message.isUnread ? "font-semibold" : "font-medium"} text-foreground`}>
                                                {message.name}
                                            </h3>
                                            <span className="text-xs text-muted-foreground ml-2">{message.date}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-1 truncate">
                                            {message.title} · {message.company}
                                        </p>
                                        <p className={`text-sm text-muted-foreground line-clamp-2 ${message.isUnread ? "font-medium" : ""}`}>
                                            {message.preview}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center rounded-xl">
                    <div className="text-center max-w-md px-6">
                        <div className="mb-8 flex justify-center relative">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 shadow-inner">
                                <Send className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground mb-3">Message anyone</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            DM peers, professionals, and recruiters to ask questions and build your network.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default MessagesListing
