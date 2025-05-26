import { Link, matchPath, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai"; 
import ProfileDropdown from "../core/Auth/ProfileDropdown";
import {IoIosArrowDropdownCircle} from "react-icons/io"
import { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { logout } from "../../services/operations/authAPI";
import {BsChevronDown} from "react-icons/bs"


const Navbar = () => {

    const {token} = useSelector( (state) => state.auth );
    const {user} = useSelector( (state) => state.profile);
    const {totalItems} = useSelector( (state) => state.cart);
    const [loading, setLoading] = useState(false)

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [subLinks, setSubLinks] = useState([]);

    const fetchSubLinks = async() => {
        try{
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("Printing Sublinks Result: ", result);
            setSubLinks(result.data.data);
        } catch(error) {
            console.log("Error while fetching category list...", error);
        }
    }

    useEffect( () => {
        fetchSubLinks();
    }, []);

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }

    return(
        <div className="flex justify-center items-center h-14 border-b-[1px] border-b-richblack-700">
            <div className="flex w-11/12 max-w-maxContent items-center justify-between ">
                {/* Image  */}
                <Link to="/">
                    <img src={logo} width={160} height={32} loading="lazy"/>
                </Link>

                {/* Nav Links  */}
                <nav className="hidden md:block">
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NavbarLinks.map((link, index) => (
                        <li key={index}>
                            {link.title === "Catalog" ? (
                            <>
                                <div
                                className={`group relative flex cursor-pointer items-center gap-1 ${
                                    matchRoute("/catalog/:catalogName")
                                    ? "text-yellow-25"
                                    : "text-richblack-25"
                                }`}
                                >
                                <p>{link.title}</p>
                                <BsChevronDown />
                                <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                    <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                    {loading ? (
                                    <p className="text-center">Loading...</p>
                                    ) : (subLinks && subLinks.length) ? (
                                    <>
                                        {subLinks
                                        ?.map((subLink, i) => (
                                            <Link
                                            to={`/catalog/${subLink.name
                                                .split(" ")
                                                .join("-")
                                                .toLowerCase()}`}
                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                            key={i}
                                            >
                                            <p>{subLink.name}</p>
                                            </Link>
                                        ))}
                                    </>
                                    ) : (
                                    <p className="text-center">No Categories Found</p>
                                    )}
                                </div>
                                </div>
                            </>
                            ) : (
                            <Link to={link?.path}>
                                <p
                                className={`${
                                    matchRoute(link?.path)
                                    ? "text-yellow-25"
                                    : "text-richblack-25"
                                }`}
                                >
                                {link.title}
                                </p>
                            </Link>
                            )}
                        </li>
                        ))}
                    </ul>
                    </nav>

                {/* login/signup/dashboard  */}
                <div className="flex gap-x-4 items-center">
                    {
                        user && user?.accountType != "Instructor" && (
                            <Link to="/dashboard/cart"  
                                    className="relative">
                                 <AiOutlineShoppingCart className="text-2xl text-richblack-100"/>
                                 {
                                    totalItems > 0 && (
                                        <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                            {totalItems}
                                        </span>
                                    )
                                 }
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="/login">
                                <button className="border-richblack-700 bg-richblack-800 text-richblack-100
                                                    rounded-md px-[12px] py-[8px]">
                                    Log In
                                </button>
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="/signup">
                                <button className="border-richblack-700 bg-richblack-800 text-richblack-100
                                                    rounded-md px-[12px] py-[8px]">
                                    Sign up
                                </button>
                            </Link>
                        )
                    }
                    {
                        token != null && (
                            <ProfileDropdown />
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Navbar;