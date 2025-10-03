import { Company } from "@/types";
import { Link } from "@inertiajs/react";
import FollowButton from "./follow-button";
import { useInitials } from "@/hooks/use-initials";

interface Props {
	company: Company;
}

const CompanyItem = ({ company }: Props) => {
	const getInitials = useInitials();

	return (
		<div className="zc-employer-list-item d-block position-relative w-100">
			<Link
				href={`/jobseeker/employers/${company.id}`}
				className="details-link"
			></Link>
			<div className="top-sec">
				<div className="left-block">
					<div className="employer-logo">
						{company.logo_url ? (
							<img
								src={company.logo_url}
								alt={company.name}
								className="mw-100"
							/>
						) : (
							<div className="flex items-center justify-center bg-muted text-foreground font-semibold uppercase">
								{getInitials(company.name)}
							</div>
						)}
					</div>
					<div className="employer-details">
						<h3 className="employer-name">{company.name}</h3>
						<p className="employer-industry">{company.industry?.name}</p>
					</div>
				</div>
				<div className="right-block">
					<FollowButton
						className="rounded-pill"
						followableId={company.id}
						followableType="company"
						isFollowing={company.is_followed}
					/>
				</div>
			</div>
			<div className="bottom-sec">
				<ul className="zc-icon-list">
					<li>
						<i className="fa-solid fa-location-dot"></i>
						<span>
							{company.address?.location.city},{" "}
							{company.address?.location.state},{" "}
							{company.address?.location.country}
						</span>
					</li>
					<li>
						<i className="fa-solid fa-user-tie"></i>
						<span>{company.size}</span>
					</li>
					<li>
						<i className="fa-solid fa-building"></i>
						<span>{company.type}</span>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default CompanyItem;
