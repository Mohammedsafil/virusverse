import React, { useState, useEffect } from 'react';
import '../stylefiles/Hero.css';
import heroImage from '../asserts/hero-image.png';

const Hero = () => {
  const [currentSolution, setCurrentSolution] = useState(0);
  const solutions = [
    'Web Applications',
    'Mobile Applications',
    'Cloud Solutions',
    'AI Integration',
    'Cyber Security',
    'Digital Transformation'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSolution((prev) => (prev + 1) % solutions.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="overlay"></div>
      <div className="hero-content">
        <div className="hero-text">
          <h2 className="hero-line first">We are, </h2>
          <h1 className="hero-line second">Viruzverse Solution</h1>
          <div className="hero-line third">
            <span className="static-text">Our Programs: </span>
            <div class="card">
              <div class="loader">
                <div class="words">
                  <span class="word">Web Development</span>
                  <span class="word">UI/Ux Design</span>
                  <span class="word">AI Integration</span>
                  <span class="word">DevOps</span>
                  <span class="word">Iot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Viruzverse Solutions" />
      </div>
    </section>
  );
};

export default Hero;
