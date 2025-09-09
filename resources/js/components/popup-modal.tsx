import { ReactNode } from "react";

interface Props {
	title: string;
	isActive: boolean;
	onClose: () => void;
	onSave: () => void;
	children: ReactNode;
}

const PopupModal = ({ title, isActive, onClose, onSave, children }: Props) => {
	return (
		<div
			className={`zc-lightbox profile-keyskill-lightbox ${isActive ? "active" : ""}`}
		>
			<div className="zc-lightbox-wrapper w-100">
				<div className="zc-btn-pclose" onClick={onClose}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 50 50"
					>
						<path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
					</svg>
				</div>
				<div className="inner-wrapper">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							onSave();
						}}
					>
						<div className="lightbox-header">
							<div className="title-and-btn">
								<h4>{title}</h4>
							</div>
						</div>

						<div
							className="lightbox-content overflow-auto py-3"
							style={{ maxHeight: "468px" }}
						>
							{children}
						</div>

						<div className="lightbox-footer">
							<a
								href="#"
								className="btn-cancel"
								onClick={(e) => {
									e.preventDefault();
									onClose();
								}}
							>
								Cancel
							</a>

							<button type="submit">Save</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default PopupModal;
