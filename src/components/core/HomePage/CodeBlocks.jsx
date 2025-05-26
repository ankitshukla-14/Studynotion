import { TypeAnimation } from "react-type-animation";
import CTAButton from "../HomePage/Button";
import HighlightText from "./HighlightText";

const CodeBlocks = ({position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor}) => {
    return(
        <div className={`flex ${position} flex-col lg:gap-10 my-20 justify-between gap-10 `}>

            {/* Section 1 */}
            <div className="w-[50%] flex flex-col gap-8">
                {heading}

                <div className="text-richblack-300 font-bold"> 
                    {subheading}
                </div>

                <div className="flex gap-7 mt-7">
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        <div className="flex gap-2 items-center">
                            {ctabtn1.btnText}
                        </div>
                    </CTAButton>
                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                        <div className="flex gap-2 items-center">
                            {ctabtn2.btnText}
                        </div>
                    </CTAButton>
                </div>


            </div>

            <div className="h-fit code-border flex flex-row text-[10px] py-3 sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]">
                {backgroundGradient}
                <div className="flex flex-col w-[10%] text-center text-richblack-400 font-inter font-bold">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>
                <div className={`flex flex-col gap-2 w-[90%] font-mono font-bold pr-2 ${codeColor}`}>
                    <TypeAnimation 
                        sequence={[codeblock, 3000, ""]}
                        cursor={true}
                        repeat={Infinity}
                        omitDeletionAnimation = {true} 
                        style={
                            {
                                whiteSpace: "pre-line",
                                display: "block",
                            }
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default CodeBlocks;