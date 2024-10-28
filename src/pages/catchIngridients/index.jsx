import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";
import BackgroundImage from "../../../public/images/catchIngridients/background.png";
import BoldImage from "../../../public/images/catchIngridients/ingridients/bold.png";
import RiceCaramelColorImage from "../../../public/images/catchIngridients/ingridients/cramel.png";
import SignatureImage from "../../../public/images/catchIngridients/ingridients/signature.png";
import ScottichMaltsImage from "../../../public/images/catchIngridients/ingridients/ten.png";
import AwardWinnerImage from "../../../public/images/catchIngridients/ingridients/twentyseven.png";
import UnstoppableImage from "../../../public/images/catchIngridients/ingridients/unstoppable.png";
import LoseModalImage from "../../../public/images/catchIngridients/lose-modal.svg";
import WinModalImage from "../../../public/images/catchIngridients/win-modal.svg";
import GameButton from "../../components/common/GameButton";
import GradientBorder from "../../components/common/GradientBorder";
import GradientText from "../../components/common/GradientText";
import { HomeIcon } from "../../components/icons/HomeIcon";
import { useNavigate } from "react-router-dom";
import BottleStateOne from "../../../public/images/catchIngridients/bottles/bottle-state-one.svg";
import BottleStateTwo from "../../../public/images/catchIngridients/bottles/bottle-state-two.svg";
import BottleStateThree from "../../../public/images/catchIngridients/bottles/bottle-state-three.svg";
import BottleStateFour from "../../../public/images/catchIngridients/bottles/bottle-state-four.svg";
import BottleStateFive from "../../../public/images/catchIngridients/bottles/bottle-state-five.svg";
import BottleStateSix from "../../../public/images/catchIngridients/bottles/bottle-state-six.svg";
import PerfectBottle from "../../../public/images/catchIngridients/bottles/perfect-bottle.svg";
import { BackArrowIcon } from "../../components/icons/BackArrowIcon";
import { CheckIcon } from "../../components/icons/CheckIcon";

function CatchIngridients() {
  const navigate = useNavigate();
  const gameRef = useRef(null);
  const appRef = useRef(null);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [, setFinalScore] = useState(0);
  const [caughtItems, setCaughtItems] = useState([]);

  // Move images array outside of useEffect
  const images = [
    { src: AwardWinnerImage, width: "auto", height: 80, name: "Award Winner" },
    { src: BoldImage, width: "auto", height: 80, name: "Bold" },
    { src: RiceCaramelColorImage, width: "auto", height: 80, name: "Rice Caramel Color" },
    { src: ScottichMaltsImage, width: "auto", height: 80, name: "Scottish Malts" },
    { src: SignatureImage, width: "auto", height: 100, name: "Signature" },
    { src: UnstoppableImage, width: "auto", height: 70, name: "Unstoppable" },
  ];

  useEffect(() => {
    // Initialize PixiJS app
    const app = new PIXI.Application({
      width: 500,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    appRef.current = app;
    gameRef.current.appendChild(app.view);

    // Game variables
    let screen = 0;
    let speed = 2;
    let score = 0;
    let caughtImages = {};
    let lastDropTime = 0;
    let dropInterval = 1000;
    let drops = [];
    let bottle;
    let scoreText;
    let messageText;
    let bottleStates = [
      BottleStateOne,
      BottleStateTwo, 
      BottleStateThree,
      BottleStateFour,
      BottleStateFive,
      BottleStateSix,
      PerfectBottle
    ];

    let gameEnded = false; // Add this flag to track if the game has ended

    // Load all bottle states
    const bottleTextures = bottleStates.map(state => PIXI.Texture.from(state));

    // Load background image and bottle image, then setup game
    Promise.all([
      PIXI.Assets.load(BackgroundImage),
      ...bottleTextures
    ]).then(([bgTexture, ...bottleTexs]) => {
      const background = new PIXI.Sprite(bgTexture);

      // Set the background to cover the game area
      background.width = app.screen.width;
      background.height = app.screen.height;

      app.stage.addChild(background);

      // Create bottle sprite
      bottle = new PIXI.Sprite(bottleTexs[0]);
      bottle.anchor.set(0.5, 1);
      bottle.width = 50;
      bottle.height = 160;
      bottle.y = app.screen.height - 80;

      app.stage.addChild(bottle);

      // Create score and message text
      scoreText = new PIXI.Text("score = 0", { fill: 0xffffff });
      messageText = new PIXI.Text("", { fill: 0xffffff, align: "center" });

      setup();
      app.ticker.add(gameLoop);
      app.view.addEventListener("click", handleClick);
    });

    // Add event listener for window resize
    const handleResize = () => {
      const newHeight = window.innerHeight;
      app.renderer.resize(500, newHeight);

      // Resize background if it exists
      if (app.stage.children[0] instanceof PIXI.Sprite) {
        const background = app.stage.children[0];
        background.width = app.screen.width;
        background.height = newHeight;
      }

      // Reposition bottle and other game elements
      if (bottle) {
        bottle.y = newHeight - 80;
      }
      if (messageText) {
        messageText.y = newHeight / 2;
      }
    };
    window.addEventListener("resize", handleResize);

    // Setup game objects
    function setup() {
      scoreText.x = 30;
      scoreText.y = 20;

      messageText.x = app.screen.width / 2;
      messageText.y = app.screen.height / 2;
      messageText.anchor.set(0.5);

      app.stage.addChild(scoreText, messageText);
    }

    // Create a new drop
    function createDrop() {
      const drop = new PIXI.Sprite();
      drop.anchor.set(0.5);
      resetDrop(drop);
      app.stage.addChild(drop);
      drops.push(drop);
    }

    // Game states
    function startScreen() {
      setShowStartScreen(true);
      setShowGameOverScreen(false);
      setShowWinScreen(false);
      drops.forEach((drop) => (drop.visible = false));
      bottle.visible = false;
      scoreText.visible = false;
      messageText.visible = false;
    }

    function gameOn() {
      setShowStartScreen(false);
      messageText.visible = true;
      bottle.visible = true;
      scoreText.visible = true;

      if (gameEnded) {
        // If the game has ended, don't create new drops or move existing ones
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastDropTime > dropInterval) {
        createDrop();
        lastDropTime = currentTime;
        // Gradually decrease the interval to increase difficulty
        dropInterval = Math.max(200, dropInterval - 10);
      }

      drops.forEach((drop, index) => {
        drop.y += speed;

        // Constrain bottle movement within the app width
        const halfBottleWidth = bottle.width / 2;
        bottle.x = Math.max(
          halfBottleWidth,
          Math.min(
            app.screen.width - halfBottleWidth,
            app.renderer.events.pointer.global.x,
          ),
        );


        // Check for collision with the bottle
        if (checkCollision(drop, bottle)) {
          const currentImage = drop.texture.textureCacheIds[0];
          if (caughtImages[currentImage]) {
            screen = 2; // Game over
          } else {
            caughtImages[currentImage] = true;
            app.stage.removeChild(drop);
            drops.splice(index, 1);
            speed += 0.1;
            score += 1;
            
            // Update caught items
            const caughtItem = images.find(img => img.src === currentImage);
            setCaughtItems(prevItems => [...prevItems, caughtItem]);
            
            // Update bottle state
            if (score <= 6) {
              bottle.texture = bottleTextures[score];
            }
            
            if (score === images.length) {
              // Show perfect bottle
              bottle.texture = bottleTextures[6];
              gameEnded = true; // Set the game ended flag
              // Set a timeout to show the win screen after a delay
              setTimeout(() => {
                screen = 3; // Win condition
              }, 2000); // 2 second delay
            }
          }
        } else if (drop.y > app.screen.height) {
          // Image missed the bottle
          app.stage.removeChild(drop);
          drops.splice(index, 1);
        }
      });
    }

    // Add this function to check for collision
    function checkCollision(drop, bottle) {
      const dropBounds = drop.getBounds();
      const bottleBounds = bottle.getBounds();

      return (
        dropBounds.x + dropBounds.width > bottleBounds.x &&
        dropBounds.x < bottleBounds.x + bottleBounds.width &&
        dropBounds.y + dropBounds.height > bottleBounds.y &&
        dropBounds.y < bottleBounds.y + bottleBounds.height
      );
    }

    function endScreen() {
      setShowGameOverScreen(true);
      setFinalScore(score);
      messageText.text = `GAME OVER\nSCORE = ${score}\nYou caught the same image twice!\nClick to play again`;
      drops.forEach((drop) => (drop.visible = false));
      bottle.visible = false;
      scoreText.visible = false;
    }

    function winScreen() {
      setShowWinScreen(true);
      setFinalScore(score);
      messageText.text = `CONGRATULATIONS!\nYou caught all ${images.length} images!\nClick to play again`;
      drops.forEach((drop) => (drop.visible = false));
      bottle.visible = false;
      scoreText.visible = false;
    }

    function resetDrop(drop) {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      drop.texture = PIXI.Texture.from(randomImage.src);

      drop.height = randomImage.height;
      drop.width =
        randomImage.width === "auto" ? randomImage.height : randomImage.width;

      const halfDropWidth = drop.width / 2;
      drop.x = Math.random() * (app.screen.width - drop.width) + halfDropWidth;
      drop.y = -drop.height / 2;
    }

    function reset() {
      score = 0;
      speed = 2;
      caughtImages = {};
      dropInterval = 1000;
      drops.forEach((drop) => {
        app.stage.removeChild(drop);
      });
      drops = [];
      if (bottle) {
        bottle.texture = bottleTextures[0]; // Reset bottle to initial empty state
      }
      setCaughtItems([]); // Reset caught items
      gameEnded = false; // Reset the game ended flag
    }

    // Main game loop
    function gameLoop() {
      if (screen === 0) {
        startScreen();
      } else if (screen === 1) {
        gameOn();
      } else if (screen === 2) {
        endScreen();
      } else if (screen === 3) {
        winScreen();
      }
    }

    // Handle click events
    function handleClick() {
      if (screen === 0) {
        screen = 1;
        reset();
        setShowStartScreen(false);
      } else if (screen === 2 || screen === 3) {
        screen = 0;
      }
    }

    // Cleanup
    return () => {
      app.destroy(true);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleStartClick = () => {
    if (appRef.current) {
      appRef.current.view.dispatchEvent(new Event("click"));
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center font-gabarito overflow-hidden">
      <div ref={gameRef} className="maw-[500px] h-full"></div>

      <GradientBorder className="absolute top-6 lg:top-10 left-[12%] md:left-[27%] lg:left-[33%] xl:left-[38%] translate-x-[-50%] from-secondary-light to-secondary-dark p-1 rounded-full">
          <GameButton
            onClick={()=> navigate('/')}
            className="rounded-full bg-gradient-to-b from-[#F8B75D] to-[#ED9B38] px-2 py-2 md:px-4 md:py-3 md:text-xl font-bold text-white hover:from-[#ED9B38] hover:to-[#F8B75D] whitespace-nowrap"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <BackArrowIcon className="md:size-6 size-4" />
              <span className="font-gabarito">Back</span>
            </div>
          </GameButton>
        </GradientBorder>
      
      {/* Ingredients Display */}
      <div className="absolute bottom-0 left-[50%] translate-x-[-50%] right-0 flex justify-center py-1 px-2 bg-opacity-50 w-[500px] gap-2">
        {images.map((item, index) => (
          <div key={index} className="text-center relative">
            <GradientBorder className=" from-secondary-light to-secondary-dark p-0.5 rounded-xl">
              <div className="bg-gradient-to-b from-primary-light to-primary-dark rounded-xl px-2">
                <img src={item.src} alt={item.name} className="size-10 md:size-14 object-contain" />
                {caughtItems.some(caught => caught.name === item.name) && (
                  <div className="flex items-center justify-center before:bg-black before:absolute before:inset-0 before:rounded-xl before:bg-opacity-50">
                  <CheckIcon className="size-5 md:size-6 absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]" />
                  </div>
                )}
                  
              </div>
            </GradientBorder>
          </div>
        ))}
      </div>
      {showStartScreen && (
        <div className="absolute inset-0 left-[50%] flex w-[500px] translate-x-[-50%] flex-col items-center justify-center bg-black bg-opacity-50 text-white backdrop:blur-xl">
          <div className="relative">
            <img
              src={WinModalImage}
              alt="Win Modal"
              className="h-auto w-[380px] md:w-[450px]"
            />
            <div className="absolute left-[50%] top-[30%] translate-x-[-50%]">
              <GradientText className="text-nowrap text-xl md:text-2xl font-extrabold">
                Catch The Ingredients
              </GradientText>
              <p className="my-8 mb-20 text-center text-sm md:text-base ">
                Catch all the ingredients{" "}
                <span className="text-xl md:text-2xl font-extrabold">
                  without repeating!
                </span>
              </p>
            </div>
            <GradientBorder className="absolute bottom-[20%] left-[50%] translate-x-[-50%] from-secondary-light to-secondary-dark p-1 rounded-full">
              <GameButton
                onClick={handleStartClick}
                className="rounded-full bg-gradient-to-b from-secondary-light to-secondary-dark px-5 md:px-8 py-2 text-xl md:text-2xl font-bold text-white hover:bg-blue-700"
              >
                <p className="font-gabarito">
                  Start Game
                </p>
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
              <p className="text-3xl font-extrabold text-center">Oops !</p>
              <p className="my-8 mb-20 text-center text-sm md:text-base  font-medium leading-loose">
                You caught
                <br />
                <span className="text-xl md:text-2xl font-extrabold">
                  Same ingredient!
                </span>
              </p>
            </div>
            <GradientBorder className="absolute bottom-[25%] left-[50%] translate-x-[-50%] from-secondary-light to-secondary-dark p-1 rounded-full">
              <GameButton
                onClick={()=> navigate('/')}
                className="rounded-full bg-gradient-to-b from-[#F8B75D] to-[#ED9B38] px-5 md:px-6 py-2 md:text-2xl text-xl font-bold text-white hover:from-[#ED9B38] hover:to-[#F8B75D] whitespace-nowrap"
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
                You caught
                <br />
                <span className="text-xl md:text-2xl font-extrabold">
                 All ingredients
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
  );
}

export default CatchIngridients;
