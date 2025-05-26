import { useSelector } from "react-redux";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import frameImg from "../../../assets/Images/frame.png"



const Template = ({title, description1, description2, image, formType}) => {
    
    const {loading} = useSelector( (state) => state.auth);

    return(
        <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] ">
            {loading ? (<div className="spinner"></div>) :
            (
                <div className="w-11/12 max-w-maxContent mx-auto flex items-center justify-center md:flex-row md:gap-x-12 md:gap-y-0 flex-col-reverse ">
                    <div className="text-richblack-5 w-11/12 max-w-[450px] md:mx-0">
                        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">{title}</h1>
                        <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
                            <span className="text-richblack-100">{description1}</span>
                            <span className="font-edu-sa font-bold italic text-blue-100">{description2}</span>
                        </p>
                        {
                            formType === "signup" ? <SignupForm/> : <LoginForm/>
                        }
                    </div>
                    <div className="relative w-11/12 max-w-[450px] mx-auto md:mx-0">
                        <img
                            src={frameImg}
                            alt="Pattern"
                            width={558}
                            height={504}
                            loading="lazy"
                        />
                        <img 
                            src={image}
                            alt="Students"
                            width={558}
                            height={504}
                            loading="lazy"
                            className="absolute -top-4 right-4 z-10"
                        />             
                    </div>
                 </div>
            )}
        </div>
    );
}

export default Template;