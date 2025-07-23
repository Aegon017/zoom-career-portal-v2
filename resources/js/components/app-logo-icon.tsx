import { ImgHTMLAttributes } from 'react';
import logo from '../assets/images/logo.png';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={logo} alt="zoom group logo" {...props} />;
}
