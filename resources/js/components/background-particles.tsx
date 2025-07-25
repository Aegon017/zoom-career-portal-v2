import bg from '../assets/images/split-background.png';

const JobSearchVisual = () => {
    return (
        <div>
            <div className="absolute inset-0 z-10 grid place-items-center">
                <img
                    src={bg}
                    alt="Job Search"
                    className="max-h-full max-w-full object-contain opacity-5 transition-transform duration-500 hover:scale-105"
                />
            </div>
        </div>
    );
};

export default JobSearchVisual;
