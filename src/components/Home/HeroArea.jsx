import { useState, useEffect } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { mediaUrl } from "../../config.js";
import "../../sass/HeroArea.scss";
const defaultGroupPhoto = "/images/group-photo.jpg";

function HeroArea() {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    async function fetchHero() {
      try {
        const res = await axios.get('/api/public/hero-area');
        if (res.data.success) {
          setHeroData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching hero area", error);
      }
    }
    fetchHero();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.5 },
    },
  };

  const imageUrl = heroData?.images?.lg 
    ? mediaUrl(`/media/images/${heroData.images.lg}`) 
    : defaultGroupPhoto;

  return (
    <section id="hero-area" className="upper-content">
      <motion.div 
        className="hero-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-content-wrapper">
          <motion.div className="hero-image-container" variants={imageVariants}>
            <div className="image-wrapper">
              <img src={imageUrl} alt="Wonders Gruppenfoto" />
              <div className="image-overlay"></div>
            </div>
          </motion.div>
          
          {(heroData?.title || heroData?.text) && (
            <motion.div className="hero-placeholder-text" variants={textVariants}>
              {heroData.title && <h2>{heroData.title}</h2>}
              {heroData.text && <p>{heroData.text}</p>}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

export default HeroArea;
