import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";
import CatchBootlesBgPng from "../../assets/catchBottlesBg.png";
import GrandRoyalBottlePng from "../../assets/GrandRoyalBottle.png";
import OtherBottle1Png from "../../assets/OthersBottle1.png";

const NUM_BOTTLES = 200; // Number of bottles to duplicate

export default function CatchBottlesGame({incrementScore,setShowWrongBottleScreen}) {
  const pixiContainerRef = useRef(null); // Reference for the PixiJS container
  const animationRef = useRef(null); // Reference for animation
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const bottleType = [
    {
      name: "GrandRoyalBottle",
      image: GrandRoyalBottlePng,
      width: (dimensions.width / 800) * 96,
      height: (dimensions.height / 1280) * 316,
    },
    {
      name: "OtherBottle1",
      image: OtherBottle1Png,
      width: (dimensions.width / 800) * 96,
      height: (dimensions.height / 1280) * 316,
    }
  ];

  const bottleDistance = (dimensions.width / 800)*105;
  let totalGrandRoyalBottles = 0;
  let keepAnimating = true;
  const [bottlePositions, setBottlePositions] = useState(
    Array.from({ length: NUM_BOTTLES }, (_, index) => ({
      x: index * bottleDistance + ((dimensions.width / 800)*800), // Initial X position
      y: (dimensions.height / 1280) * 780, // Y position of each bottle
    })),
  );

  let time = 0;
  let previousTime = 0;

  // Handle bottle click
  const handleClick = (index,type) => {
    if (type === 0) {
      incrementScore();
      
      totalGrandRoyalBottles++;
    }else{
      setShowWrongBottleScreen(true);
      keepAnimating = false;
    }
    if (totalGrandRoyalBottles === 10) {
      // console.log("Game win!");
      keepAnimating = false;
      
    }
    // alert(`Bottle ${index} clicked!`);
  };

  // Resize window handler
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // PixiJS initialization and animation setup
  useEffect(() => {
    const app = new PIXI.Application({
      width: dimensions.width,
      height: dimensions.height,
      backgroundAlpha: 0,
      zIndex: 0,
    });

    if (pixiContainerRef.current) {
      pixiContainerRef.current.appendChild(app.view);
    }

    // Load background sprite
    const backgroundSprite = PIXI.Sprite.from(CatchBootlesBgPng);
    backgroundSprite.width = dimensions.width;
    backgroundSprite.height = dimensions.height;
    backgroundSprite.anchor.set(0.5);
    backgroundSprite.x = dimensions.width / 2;
    backgroundSprite.y = dimensions.height / 2;
    app.stage.addChild(backgroundSprite);

    // // Load main bottle sprite
    // const mainBottle = PIXI.Sprite.from(GrandRoyalBottlePng);
    // mainBottle.width = (dimensions.width / 800) * 96;
    // mainBottle.height = (dimensions.height / 1280) * 316;
    // mainBottle.anchor.set(0.5);
    // mainBottle.x = dimensions.width / 2;
    // mainBottle.y = dimensions.height / 2;
    // mainBottle.interactive = true;
    // mainBottle.buttonMode = true;
    // mainBottle.on("pointerover", () => console.log("Bottle hovered!"));
    // app.stage.addChild(mainBottle);

    // Load duplicated bottle sprites
    const bottles = bottlePositions.map((position, index) => {
      const type = Math.random() < 0.5 ? 0 : 1;
      const bottle = PIXI.Sprite.from(bottleType[type].image);
      bottle.width = bottleType[type].width;
      bottle.height = bottleType[type].height;
      bottle.x = position.x;
      bottle.y = position.y;
      bottle.anchor.set(0.5);
      bottle.interactive = true;
      bottle.buttonMode = true;
      bottle.on("pointertap", () => handleClick(index,type));
      app.stage.addChild(bottle);
      return bottle;
    });

    // Animation logic for moving bottles
    previousTime = Math.floor(new Date().getTime() / 1000);
    const animateBottles = () => {
      time = Math.floor(new Date().getTime() / 1000);
      bottles.forEach((bottle, index) => {
        bottle.x -= 2 * (Math.ceil((time - previousTime) / 7) / 2);
      });
      if (time - previousTime <= 30 && keepAnimating) {
        animationRef.current = requestAnimationFrame(animateBottles);
      }
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animateBottles);

    // Cleanup PixiJS application and animation on component unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
      app.destroy(true, true);
      if (pixiContainerRef.current) {
        pixiContainerRef.current.innerHTML = "";
      }
    };
  }, [dimensions, bottlePositions]);

  return (
    <div ref={pixiContainerRef} style={{ position: "relative", zIndex: 0 }} />
  );
}
