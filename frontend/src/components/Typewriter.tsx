import { useState, useEffect } from "react";
import styles from "./Typewriter.module.scss";

interface TypewriterProps {
  text: string;
  typeSpeed: number;
  deleteSpeed: number;
  delay: number;
  initialDelay?: number;
}

  export const Typewriter = ({ text, typeSpeed, deleteSpeed, delay, initialDelay }: TypewriterProps) => {
  const textArray = text.split(";");
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [delayOver, setDelayOver] = useState(false);
  useEffect(() => {
    if (!delayOver) setTimeout(() => setDelayOver(true), initialDelay);
    else setTimeout(() => {
      const currentChar = textArray[textIndex].charAt(currentText.length);
      setCurrentText(isDeleting?currentText.slice(0, -1):currentText + currentChar);
      if (!isDeleting && currentText === textArray[textIndex]) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setTextIndex((textIndex + 1) % textArray.length);
      }
    }, isDeleting ? deleteSpeed : typeSpeed);
  }, [currentText, isDeleting, delayOver]);

  return (
    <>
      {currentText}
      <span className={styles.cursor} />
    </>
  );
}
