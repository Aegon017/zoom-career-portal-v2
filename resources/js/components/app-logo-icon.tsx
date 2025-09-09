import { ImgHTMLAttributes } from "react";

export default function AppLogoIcon(
	props: ImgHTMLAttributes<HTMLImageElement>,
) {
	return <img src="/logo.png" alt="zoom group logo" {...props} />;
}
