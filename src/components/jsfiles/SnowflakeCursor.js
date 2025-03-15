'use client';
import React, { useEffect, useRef } from 'react';

const CharacterCursor = ({
  characters = ['v', 'i', 'r', 'u', 'z', 'x', 'y', 'z'], // Increased number of characters
  colors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFFFFF'], // Bright Neon Colors
  cursorOffset = { x: 0, y: 0 },
  font = '18px serif',
  characterLifeSpanFunction = () => Math.floor(Math.random() * 60 + 90), // Faster lifespan
  initialCharacterVelocityFunction = () => ({
    x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 2.5, // Increased movement speed
    y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 2.5,
  }),
  characterVelocityChangeFunctions = {
    x_func: () => (Math.random() < 0.5 ? -1 : 1) / 60, // Faster change rate
    y_func: () => (Math.random() < 0.5 ? -1 : 1) / 40,
  },
  characterScalingFunction = (age, lifeSpan) =>
    Math.max(((lifeSpan - age) / lifeSpan) * 2, 0), // Adjusted scaling
  characterNewRotationDegreesFunction = (age, lifeSpan) => (lifeSpan - age) / 10, // Increased rotation speed
  wrapperElement,
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const cursorRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const canvImagesRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let canvas = null;
    let context = null;
    let width = window.innerWidth;
    let height = window.innerHeight;

    class Particle {
      constructor(x, y, canvasItem) {
        this.rotationSign = Math.random() < 0.5 ? -1 : 1;
        this.age = 0;
        this.initialLifeSpan = characterLifeSpanFunction();
        this.lifeSpan = this.initialLifeSpan;
        this.velocity = initialCharacterVelocityFunction();
        this.position = { x: x + cursorOffset.x, y: y + cursorOffset.y };
        this.canv = canvasItem;
      }
      update(context) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.lifeSpan--;
        this.age++;

        this.velocity.x += characterVelocityChangeFunctions.x_func(this.age, this.initialLifeSpan);
        this.velocity.y += characterVelocityChangeFunctions.y_func(this.age, this.initialLifeSpan);

        const scale = characterScalingFunction(this.age, this.initialLifeSpan);
        const degrees = this.rotationSign * characterNewRotationDegreesFunction(this.age, this.initialLifeSpan);
        const radians = degrees * 0.0174533;

        context.translate(this.position.x, this.position.y);
        context.rotate(radians);
        context.drawImage(
          this.canv,
          (-this.canv.width / 2) * scale,
          -this.canv.height / 2,
          this.canv.width * scale,
          this.canv.height * scale
        );
        context.rotate(-radians);
        context.translate(-this.position.x, -this.position.y);
      }
    }

    const init = () => {
      if (prefersReducedMotion.matches) {
        console.log('Motion is reduced; cursor effect disabled.');
        return false;
      }

      canvas = canvasRef.current;
      if (!canvas) return;
      context = canvas.getContext('2d');
      if (!context) return;

      canvas.style.top = '0px';
      canvas.style.left = '0px';
      canvas.style.pointerEvents = 'none';

      if (wrapperElement) {
        canvas.style.position = 'absolute';
        wrapperElement.appendChild(canvas);
        canvas.width = wrapperElement.clientWidth;
        canvas.height = wrapperElement.clientHeight;
      } else {
        canvas.style.position = 'fixed';
        document.body.appendChild(canvas);
        canvas.width = width;
        canvas.height = height;
      }

      context.font = font;
      context.textBaseline = 'middle';
      context.textAlign = 'center';

      characters.forEach((char) => {
        let measurements = context.measureText(char);
        let bgCanvas = document.createElement('canvas');
        let bgContext = bgCanvas.getContext('2d');

        if (bgContext) {
          bgCanvas.width = measurements.width * 2;
          bgCanvas.height = measurements.actualBoundingBoxAscent * 3;

          bgContext.textAlign = 'center';
          bgContext.font = font;
          bgContext.textBaseline = 'middle';

          let randomColor = colors[Math.floor(Math.random() * colors.length)];
          bgContext.fillStyle = randomColor;
          bgContext.shadowColor = randomColor;
          bgContext.shadowBlur = 10;
          bgContext.fillText(char, bgCanvas.width / 2, bgCanvas.height / 2);

          canvImagesRef.current.push(bgCanvas);
        }
      });

      bindEvents();
      loop();
    };

    const bindEvents = () => {
      const element = wrapperElement || document.body;
      element.addEventListener('mousemove', (e) => addParticle(e.clientX, e.clientY));
      window.addEventListener('resize', onWindowResize);
    };

    const onWindowResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvasRef.current) return;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    };

    const addParticle = (x, y) => {
      if (particlesRef.current.length > 15) return; // Allow more particles
      const img = canvImagesRef.current[Math.floor(Math.random() * canvImagesRef.current.length)];
      if (img) {
        particlesRef.current.push(new Particle(x, y, img));
      }
    };

    const loop = () => {
      if (!canvas || !context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((particle) => particle.update(context));
      particlesRef.current = particlesRef.current.filter((particle) => particle.lifeSpan > 0);
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    init();
    return () => {
      if (canvas) canvas.remove();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [characters, colors, font, wrapperElement]);

  return <canvas ref={canvasRef} />;
};

export default CharacterCursor;