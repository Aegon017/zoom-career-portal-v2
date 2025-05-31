import bg from "../assets/images/split-background.png";

const JobSearchVisual = () => {
    return (
        <div>
            <div className="absolute inset-0 grid place-items-center z-10 ">
                <img
                    src={bg}
                    alt="Job Search"
                    className="max-w-full opacity-5 max-h-full object-contain transition-transform duration-500 hover:scale-105"
                />
            </div>
        </div>
    );
};

export default JobSearchVisual;
