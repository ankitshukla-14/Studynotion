import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import Tab from "../../common/Tab";
import {toast} from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setSignupData } from "../../../slice/authSlice";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../../services/operations/authAPI";


const SignupForm = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {firstName, lastName, email, password, confirmPassword} = formData;

    const tabData = [
        {
            id:1,
            tabName: "Student",
            type: ACCOUNT_TYPE.STUDENT,
        },
        {
            id:2,
            tabName: "Instructor",
            type: ACCOUNT_TYPE.INSTRUCTOR,
        }
    ];

    const handleOnChange = (e) => {
        setFormData( (prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    }

    const handleOnSubmit = (e) => {
        // prevent default behaviour
        e.preventDefault();
        // chk password == confirmPassword ?
        if(password.length < 8 || password.length > 12 ) {
            alert("Password must be between 8 and 12 characters");
            return;
        }
        if(password !== confirmPassword) {
            toast.error("Password Do Not Match");
            return;
        }
        // create form data and store it to use after otp validation
        const signupData = {
            ...formData,
            accountType,
        }

        // saving signup data and going to api function
        dispatch(setSignupData(signupData));
        dispatch(sendOtp(formData.email, navigate));

        //Reset
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setAccountType(ACCOUNT_TYPE.STUDENT);
    }

    return(
        <div>
            <Tab tabData={tabData} field={accountType} setField={setAccountType} />
            <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
                <div className="flex gap-x-4 flex-col sm:flex-row">
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            First Name <sup className="text-pink-200">*</sup></p>
                        <input
                            required
                            type="text"
                            name="firstName"
                            value={firstName}
                            placeholder="Enter first name"
                            onChange={handleOnChange}
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                        />
                    </label>
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Last Name <sup className="text-pink-200">*</sup></p>
                        <input
                            required
                            type="text"
                            name="lastName"
                            value={lastName}
                            placeholder="Enter last name"
                            onChange={handleOnChange}
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                              }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                        />
                    </label>
                </div>
                <label className="w-full">
                    <p className="mb-1 text-[0.875rem] leading-[1.375] text-richblack-5">
                        Email Address <sup className="text-pink-200">*</sup></p>
                        <input
                            required
                            type="text"
                            name="email"
                            value={email}
                            placeholder="Enter email address"
                            onChange={handleOnChange}
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                        />
                </label>
                <div className="flex gap-x-4 flex-col sm:flex-row">
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Create Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input 
                            required
                            type= {showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            placeholder="Enter Password"
                            onChange={handleOnChange}
                            minLength={8}
                            maxLength={12}
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
                        />
                        <span 
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-[38px] cursor-pointer">
                            {
                                showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>) :
                                                (<AiOutlineEye fontSize={24} fill="#AFB2BF"/>)
                            }
                        </span>
                    </label>
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Confirm Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input 
                            required
                            type= {showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={confirmPassword}
                            placeholder="Confirm Password"
                            onChange={handleOnChange}
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
                        />
                        <span 
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-[38px] cursor-pointer">
                            {
                                showConfirmPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>) :
                                                (<AiOutlineEye fontSize={24} fill="#AFB2BF"/>)
                            }
                        </span>
                    </label>  
                </div>
                <button
                    type="submit"
                    className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
}

export default SignupForm;