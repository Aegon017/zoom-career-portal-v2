import React from "react";

interface EditButtonProps {
	onClick: () => void;
	id?: string;
	className?: string;
	ariaLabel?: string;
}

const EditButton: React.FC<EditButtonProps> = ({
	onClick,
	id,
	className = "zc-btn-edit",
	ariaLabel = "Edit",
}) => {
	return (
		<a
			href="#"
			onClick={(e) => {
				e.preventDefault();
				onClick();
			}}
			id={id}
			className={className}
			aria-label={ariaLabel}
		>
			<i className="fa-solid fa-pencil"></i>
		</a>
	);
};

export default EditButton;
