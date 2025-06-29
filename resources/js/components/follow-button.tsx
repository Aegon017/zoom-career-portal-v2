import { useState } from "react";
import { router } from "@inertiajs/react";

interface FollowButtonProps {
    followableId: number;
    followableType: "user" | "company";
    isFollowing: boolean;
    className?: string;
}

export default function FollowButton( {
    followableId,
    followableType,
    isFollowing: initiallyFollowing,
    className = "",
}: FollowButtonProps ) {
    const [ isFollowing, setIsFollowing ] = useState( initiallyFollowing );
    const [ loading, setLoading ] = useState( false );

    const handleFollowToggle = () => {
        if ( loading ) return;
        setLoading( true );

        router.post(
            "/follow/toggle",
            {
                followable_id: followableId,
                followable_type: followableType,
            },
            {
                preserveScroll: true,
                onSuccess: () => setIsFollowing( ( prev ) => !prev ),
                onFinish: () => setLoading( false ),
            }
        );
    };

    return (
        <button
            type="button"
            onClick={ handleFollowToggle }
            disabled={ loading }
            className={ `btn-follow ${ className }` }
        >
            <i className="fa-solid fa-user-plus"></i>{ loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow" }
        </button>
    );
}
