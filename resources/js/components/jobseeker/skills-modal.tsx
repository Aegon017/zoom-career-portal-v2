import { useState, useEffect } from "react";
import { Skill, User } from "@/types";
import PopupModal from "../popup-modal";
import { router } from "@inertiajs/react";
import { useForm, SubmitHandler } from "react-hook-form";

interface SkillsModalProps {
    isActive: boolean;
    handleClose: () => void;
    defaultValues: {
        user: User;
        skills: Skill[];
    };
}

interface SkillsFormInputs {
    skills: string[];
}

const SkillsModal: React.FC<SkillsModalProps> = ({ isActive, handleClose, defaultValues }) => {
    const initialSkills = defaultValues.user.skills?.map(skill => skill.name) || [];

    const [inputValue, setInputValue] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);

    const { handleSubmit, setValue } = useForm<SkillsFormInputs>({
        defaultValues: { skills: initialSkills }
    });

    useEffect(() => {
        setValue("skills", selectedSkills);
    }, [selectedSkills, setValue]);

    const onSubmit: SubmitHandler<SkillsFormInputs> = (data) => {
        router.post(route("jobseeker.profile.skills.store"), { ...data });
        handleClose();
    };

    const handleAddSkill = (skill: string) => {
        const trimmedSkill = skill.trim();
        if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
            setSelectedSkills(prev => [...prev, trimmedSkill]);
            setInputValue("");
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setSelectedSkills(prev => prev.filter(s => s !== skill));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSkill(inputValue);
        }
    };

    const filteredSuggestions = defaultValues.skills
        .map(s => s.name)
        .filter(name =>
            name.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedSkills.includes(name)
        );

    return (
        <PopupModal
            title=""
            isActive={isActive}
            onClose={handleClose}
            onSave={handleSubmit(onSubmit)}
        >
            <div className="lightbox-header">
                <div className="title-and-btn">
                    <h4>Key Skills</h4>
                </div>
                <p className="mb-0">Add skills that best define your expertise.</p>
            </div>

            <div className="lightbox-content py-3">
                <div className="added-skills-wrapper">
                    <h4>Skills</h4>
                    <ul className="added-skills mb-4">
                        {selectedSkills.map((skill, index) => (
                            <li key={index} className="skill-item">
                                <span className="txt">{skill}</span>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleRemoveSkill(skill); }}>x</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="zc-search-dropdown-wrapper">
                    <input
                        type="text"
                        id="key-skill-search"
                        className="search-field"
                        placeholder="Add Skills"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    {inputValue && filteredSuggestions.length > 0 && (
                        <div id="skills-suggestions-dropdown" className="suggestions-list-wrapper">
                            {filteredSuggestions.map((skill, idx) => (
                                <div
                                    key={idx}
                                    className="suggestions-list-item"
                                    onClick={() => handleAddSkill(skill)}
                                    style={{ cursor: "pointer", padding: "8px 12px", background: "#fff" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#f5f7fa"}
                                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PopupModal>
    );
};

export default SkillsModal;
