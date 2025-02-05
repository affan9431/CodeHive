import { FaGraduationCap, FaPlay, FaUser } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
function CardWrapper({ title, paragraph, logo, color }) {
  return (
    <div className="flex gap-2">
      <div
        style={{ backgroundColor: color }}
        className="mt-1  rounded-[50%] w-10 h-10 flex items-center justify-center text-white"
      >
        {logo && logo}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-1">{title}</h2>
        <p>{paragraph}</p>
      </div>
    </div>
  );
}

function HomeSection2() {
  return (
    <div className="flex flex-col gap-10 items-center justify-around mt-10 md:flex-row">
      <div>
        <img
          src="../../public/hero2.png"
          alt=""
          className="w-80 h-80 md:w-96 md:h-96"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4 md:text-3xl">
          <span className="text-[#EAC1F4] ">Benefits</span> From Our Online{" "}
          <br />
          Learning
        </h1>
        <div className="flex flex-col gap-3">
          <CardWrapper
            title="Online Degrees"
            paragraph="Lorem ipsum dolor sit amet, conm"
            logo={<FaGraduationCap />}
            color="#D4ABF3"
          />
          <CardWrapper
            title="Short Courses"
            paragraph="Lorem ipsum dolor sit amet, conm"
            logo={<IoBookOutline />}
            color="#FC91AE"
          />
          <CardWrapper
            title="Training For Experts"
            paragraph="Lorem ipsum dolor sit amet, conm"
            logo={<FaUser />}
            color="#D4ABF3"
          />
          <CardWrapper
            title="1.5k + Video Courses"
            paragraph="Lorem ipsum dolor sit amet, conm"
            logo={<FaPlay />}
            color="#FC91AE"
          />
        </div>
      </div>
    </div>
  );
}

export default HomeSection2;
