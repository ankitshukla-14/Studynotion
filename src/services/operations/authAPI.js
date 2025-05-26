import {toast} from "react-hot-toast";
import { setLoading, setToken } from "../../slice/authSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";
import { setUser } from "../../slice/profileSlice";
import { resetCart } from "../../slice/cartSlice";

const {SENDOTP_API, SIGNUP_API, LOGIN_API, RESETPASSTOKEN_API, RESETPASSWORD_API} = endpoints;


export function sendOtp(email, navigate) {
    return async (dispatch) => {
        // const toastId = toast.loading("Loading....");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", SENDOTP_API, {email});

            console.log("SENDOTP API RESPONSE.....", response);

            console.log(response.data.success);

            if(!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("OTP Sent Successfully");
            navigate("/verify-email");
        } catch(error) {
            console.log("SENDOTP API ERROR.....", error);
            toast.error(error.response.data.message);
        }
        dispatch(setLoading(false));
        // toast.dismiss(toastId);
    }
}

export function signup(firstName, lastName, email, password, confirmPassword, accountType, otp, navigate) {
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", SIGNUP_API, 
                {firstName, lastName, email, password, confirmPassword, accountType, otp}
            );
            console.log("SIGNUP API RESPONSE....", response);

            if(!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Signup Successful");
            navigate("/login");
        } catch(error) {
            console.log("SIGNUP API ERROR...", error);
            toast.error(error.response.data.message);
        }
        dispatch(setLoading(false));
    }
}

export function login(email, password, navigate) {
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", LOGIN_API, {email, password})
            console.log("LOGIN API RESPONSE...", response);

            if(!response.data.success) {
                throw new Error(response.data.message);

            }

            toast.success("Login Successfull");
            dispatch(setToken(response.data.token));
            dispatch(setUser(response.data.user))
            localStorage.setItem("token", JSON.stringify(response.data.token)); 
            localStorage.setItem("user", JSON.stringify(response.data.user)); 
            navigate("/dashboard/my-profile");
            
        } catch(error) {
            console.log("LOGIN API Error", error);
            toast.error(error.response.data.message);
        }
        dispatch(setLoading(false));
    }
}

export function logout(navigate) {
    return async(dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}

export function getPassowrdResetToken(email, setEmailSent) {
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {email});
            console.log("RESET PASSWORD TOKEN RESPONSE...", response);
            if(!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Reset Email Sent");
            setEmailSent(true);
        }
        catch(error) {
            console.log("RESET PASSWORD TOKEN Error", error);
            toast.error("Can't send mail");
        }
        dispatch(setLoading(false));
    }
}

export function resetPassword(password, confirmPassword, token, navigate) {
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});
            console.log("RESET PASSWORD RESPONSE...", response);

            if(!response.data.success) {
                throw new Error(response.data.message);

            }

            toast.success("Password Reset Successfully");
            navigate("/login");
        }
        catch(error) {
            console.log("RESET PASSWORD Error", error);
            toast.error("Unable to reset password");
        }
        dispatch(setLoading(false));
    }
}