import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import {BiArrowBack} from "react-icons/bi"
import { RxCountdownTimer } from "react-icons/rx";
import { sendOtp, signup } from "../services/operations/authAPI";
import Countdown from "react-countdown";


const VerifyEmail = () => {

    useEffect(() => {
        if(!signupData) {
            navigate("/signup");
        }
    }, []);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loading, signupData} = useSelector((state) => state.auth);
    const [otp, setOtp] = useState("");


    
    const handleOnSubmit = (e) => {
        e.preventDefault();
        const {firstName, lastName, email, password, confirmPassword, accountType} = signupData;

        dispatch(signup(firstName, lastName, email, password, confirmPassword, accountType, otp, navigate));
    }

    const renderer = ({seconds, completed}) => {
        if(completed) {
           return <button onClick={() => dispatch(sendOtp(signupData.email, navigate))}
                className="flex items-center text-blue-100 gap-x-2">
                <RxCountdownTimer/>
                Resend 
            </button>
        } else {
            return <span className="text-blue-100 mr-7">{seconds} sec</span>
        }
    }

    return(
        <div className="min-h-[calc(100vh-3.5rem)] flex justify-center items-center">
            {loading ? (
                <div className="Spinner"></div>
            ) :
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
                        Verify Email</h1>
                    <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
                        A verification code has been sent to you. Enter the code below</p>
                    <form onSubmit={handleOnSubmit}>
                        <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => (
                            <input
                            {...props}
                            placeholder="-"
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                            />
                        )}
                        containerStyle={{
                            justifyContent: "space-between",
                            gap: "0 6px",
                        }}
                        />
                        <button type="submit" className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900">
                            Verify Email
                        </button>
                    </form>
                    <div className="mt-6 flex items-center justify-between"> 
                        <Link to="/signup">
                            <div className="text-richblack-5 flex items-center gap-x-2">
                                <BiArrowBack/>
                                Back to Signup
                            </div>
                        </Link>
                        <div>
                            <Countdown date={Date.now() + 30000} renderer={renderer}/>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default VerifyEmail;