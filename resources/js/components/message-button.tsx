import { Link } from "@inertiajs/react";
import { ReactNode } from "react";
interface Props {
    userId: number;
    children: ReactNode;
}
const MessageButton = ( { userId, children }: Props ) => {
    return (
        <Link href={ `/inbox?user=${ userId }` } className="w-fit">
            { children }
        </Link>
    )
}

export default MessageButton