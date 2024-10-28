import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import CatchBottlesBgPng from "../../assets/catchBottlesBg.png";
import GameButton from "../../components/common/GameButton";
import GradientBorder from "../../components/common/GradientBorder";
import { BackArrowIcon } from "../../components/icons/BackArrowIcon";
import CatchBottlesGame from "./game";
import LoseModalImage from "../../../public/images/catchBottles/timeUp.svg";
import WinModalImage from "../../../public/images/catchBottles/win2.svg";
import WrongModalImage from "../../../public/images/catchBottles/wrongBottle.svg";
import { HomeIcon } from "../../components/icons/HomeIcon";
import GradientText from "../../components/common/GradientText";

export default function CatchBottlesPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30);
  const [showGameOverScreen , setShowGameOverScreen] = useState(false);
  const [showWinScreen , setShowWinScreen] = useState(false);
  const [showWrongBottleScreen, setShowWrongBottleScreen] = useState(false);
  const [score, setScore] = useState(0);
  const incrementScore = () => {
    setScore((prevScore) =>{
    const newScore = prevScore + 1;
    if (newScore === 10) {
      setShowWinScreen(true);
    }
    return newScore;
  } );
};

  useEffect(() => {
    if (timeLeft > 0 && showWinScreen === false && showWrongBottleScreen === false) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup interval on unmount
    } 
    else if (timeLeft === 0) {
      setShowGameOverScreen(true);
    }
    
  }, [timeLeft, showWinScreen]);
    
      
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec.toString().padStart(2, "0")}`;
  };
  const timerColorClass = timeLeft < 10 ? "text-red-500" : "text-white";
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-b from-[#2C2A6C] to-[#1E1B3E] overflow-hidden">
      
      {/* Top Navigation and Timer - Updated for Flex Layout */}
      <div className="absolute top-4 flex w-full max-w-screen-lg justify-between items-center px-4 gap-4 z-20">
        <GradientBorder className="rounded-full from-secondary-light to-secondary-dark p-1">
          <GameButton
            onClick={() => navigate("/")}
            className="whitespace-nowrap flex items-center rounded-full bg-gradient-to-b from-[#F8B75D] to-[#ED9B38] px-4 py-2 font-bold text-white hover:from-[#ED9B38] hover:to-[#F8B75D]"
          >
            <BackArrowIcon className="mr-2" />
            Back
          </GameButton>
        </GradientBorder>
        
        <GradientBorder className="rounded-full from-secondary-light to-secondary-dark p-1">
          <GameButton className="whitespace-nowrap flex items-center rounded-full bg-gradient-to-b from-[#F8B75D] to-[#ED9B38] px-4 py-2 font-bold text-white">
            <span className={`font-gabarito ${timerColorClass}`}>
              Timer: {formatTime(timeLeft)}
            </span>
          </GameButton>
        </GradientBorder>
      </div>

      {/* Game Area */}
      <div className="relative flex-grow flex justify-center items-center w-full max-w-screen-lg">
        <CatchBottlesGame incrementScore={incrementScore} setShowWrongBottleScreen={setShowWrongBottleScreen} />
      </div>

        <div className="fixed bottom-0 left-0 w-full flex justify-center pointer-events-none z-20">
    <svg
      className="w-[75%] max-w-[500px] h-auto"
      viewBox="0 0 400 100" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        pointerEvents: 'none', // Ensures the SVG doesn't interfere with PixiJS interactions
        position: 'relative',  // Positions it within the container
        zIndex: 20,            // Ensures it stays above PixiJS elements
      }}
    >
      <defs>
      <linearGradient id="rectGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#F2BC3E", stopOpacity: 1 }} /> 
          <stop offset="100%" style={{ stopColor: "#D87E12", stopOpacity: 1 }} /> 
        </linearGradient>

        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#C57411", stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "#844E0B", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <polygon points="80,100 320,100 340,30 60,30" fill="url(#gradient)" />
      <rect x="61" y="0" width="278" height="60" fill="url(#rectGradient)" rx="30" ry="30" />
      <text x="200" y="35" textAnchor="middle" fontSize="24" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold">
        You got: {score} 
      </text>

      <circle cx="155" cy="81" r="11" fill="none" stroke="#7E2D11" strokeWidth="2" />
      <text x="155" y="83" textAnchor="middle" fontSize="10" fill="white" fontFamily="Inter" >
        18+
      </text>
      <text x="172" y="83" textAnchor="start" fontSize="10" fill="white" fontFamily="Inter, sans-serif" >
        Drink Responsibly
      </text>
    </svg>
</div>

      {/* Game Area */}
      {/* <CatchBottlesGame incrementScore={incrementScore} setShowWrongBottleScreen={setShowWrongBottleScreen}/> */}
      
      {showWrongBottleScreen && (
        <div className="absolute inset-0 left-[50%] flex w-[500px] translate-x-[-50%] flex-col items-center justify-center bg-black bg-opacity-50 text-white backdrop:blur-xl">
          <div className="relative">
            <img
              src={WrongModalImage}
              alt="Wrong Modal"
              className="h-auto w-[380px] md:w-[450px]"
            />
            <div className="absolute left-[50%] top-[30%] translate-x-[-50%]">
              <p className="text-1.5xl font-extrabold text-center">Oops !</p>
              <p className="my-8 mb-20 text-center text-sm md:text-base  font-medium leading-loose">
                You got
                <br />
                <span className="text-xl md:text-2xl font-extrabold">
                  Wrong bottle
                </span>
              </p>
            </div>
            <GradientBorder className="absolute bottom-[25%] left-[50%] translate-x-[-50%] from-secondary-light to-secondary-dark p-1 rounded-full">
              <GameButton
                onClick={()=> navigate('/')}
                className="rounded-full bg-gradient-to-b from-[#F8B75D] to-[#ED9B38] px-5 md:px-6 py-2 md:text-2xl text-xl font-bold text-white hover:from-[#ED9B38] hover:to-[#F8B75D] whitespace-nowrap"
              >
                <div className="flex items-center gap-3">
                  <HomeIcon className="w-5 h-5" />
                  <span className="font-gabarito">Back to home</span>
                </div>
              </GameButton>
            </GradientBorder>
          </div>
        </div>
      )}

        {showGameOverScreen && (
        <div className="absolute inset-0 left-[50%] flex w-[500px] translate-x-[-50%] flex-col items-center justify-center bg-black bg-opacity-50 text-white backdrop:blur-xl">
          <div className="relative">
            <img
              src={LoseModalImage}
              alt="Lose Modal"
              className="h-auto w-[380px] md:w-[450px]"
            />
            <div className="absolute left-[50%] top-[30%] translate-x-[-50%]">
              <p className="text-1.5xl font-extrabold text-center">Sorry</p>
              <p className="my-8 mb-20 text-center text-sm md:text-base  font-medium leading-loose">
                Your session has
                <br />
                <span className="text-xl md:text-2xl font-extrabold">
                  Time out
                </span>
              </p>
            </div>
            <GradientBorder className="absolute bottom-[25%] left-[50%] translate-x-[-50%] from-secondary-light to-secondary-dark p-1 rounded-full">
              <GameButton
                onClick={()=> navigate('/')}
                className="rounded-full bg-gradient-to-b from-[#F8B75D] to-[#ED9B38] px-5 md:px-6 py-2 md:text-2xl text-xl font-bold text-white hover:from-[#ED9B38] hover:to-[#F8B75D] whitespace-nowrap"
              >
                <div className="flex items-center gap-3">
                  <HomeIcon className="w-5 h-5" />
                  <span className="font-gabarito">Back to home</span>
                </div>
              </GameButton>
            </GradientBorder>
          </div>
        </div>
      )}
      {showWinScreen && (
        <div className="absolute inset-0 left-[50%] flex w-[500px] translate-x-[-50%] flex-col items-center justify-center bg-black bg-opacity-50 text-white backdrop:blur-xl">
          <div className="relative">
            <img
              src={WinModalImage}
              alt="Win Modal"
              className="h-auto w-[380px] md:w-[450px]"
            />
            <div className="absolute left-[50%] top-[30%] translate-x-[-50%]">
              <GradientText className="text-nowrap text-xl md:text-2xl font-extrabold">
                Congratulations!
              </GradientText>
              <p className="my-8 mb-20 text-center text-sm md:text-base font-medium  leading-loose">
                You got
                <br />
                <span className="text-xl md:text-2xl font-extrabold">
                 10 bottles
                </span>
              </p>
            </div>
            <GradientBorder className="absolute bottom-[20%] left-[50%] translate-x-[-50%] from-secondary-light to-secondary-dark p-1 rounded-full">
              <GameButton
                onClick={()=> navigate('/')}
                className="rounded-full bg-gradient-to-b from-[#F8B75D] to-[#ED9B38] px-5 md:px-6 py-2 text-xl font-bold text-white hover:from-[#ED9B38] hover:to-[#F8B75D] whitespace-nowrap"
              >
                <div className="flex items-center gap-3">
                  <HomeIcon className="w-6 h-6" />
                  <span className="font-gabarito">Back to home</span>
                </div>
              </GameButton>
            </GradientBorder>
          </div>
        </div>
      )}
      </div>
    // </div>
  );
}
