import { Card, CardContent } from '../ui/card'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { Button } from '../ui/button'

const JobseekerFilters = () => {
    return (
        <Card className="mb-6 p-0 shadow-none border-0 border-b-2 rounded-none">
            <CardContent className="p-0 pb-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search companies..."
                            className="pl-10"
                        />
                    </div>
                    <Select>
                        <SelectTrigger className="sm:w-40">
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            <SelectItem value="hyderabad">Hyderabd</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="sm:w-40">
                            <SelectValue placeholder="Industry" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Industries</SelectItem>
                            <SelectItem value="it">IT</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="sm:w-40">
                            <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sizes</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}

export default JobseekerFilters