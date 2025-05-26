import Template from "../components/core/Auth/Template";
import singupImg from "../assets/Images/signup.webp"


const Signup = () => {
    return(
        <Template
            title="Join the millions learning to code with StudyNotion for free"
            description1="Build skills for today, tomorrow and beyond."
            description2="Education to future-proof your carrier."
            image={singupImg}
            formType="signup"
        />
            
    );
}

export default Signup;