import { useEffect, useState } from "react"
import { useRef } from "react";

export default function EmptyCell({ solution, rowIndex, colIndex, handleCorrect }) {

  const [inputValue, setInputValue] = useState("");
  const [incorrectSubmission, setIncorrectSubmission] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (incorrectSubmission) {
      const timerId = setTimeout(() => {
        setInputValue("");
        setIncorrectSubmission(false);
      }, 900);
      return () => clearTimeout(timerId);
    }
  }, [incorrectSubmission]);

  function handleSubmit(formData) {
    inputRef.current.blur();
    const value = Number(formData.get("cell"));
    if (isNaN(value)) {
      alert("Please enter a number.");
      setInputValue("");
      return;
    }
    if (solution[rowIndex][colIndex] === value) {
      handleCorrect(rowIndex, colIndex, value);
    }
    else {
      setInputValue(value);
      setIncorrectSubmission(true);
    }
  }

  return (
      <form action={handleSubmit}>
        <input
          ref={inputRef}
          style={{color: incorrectSubmission ? "red" : "black"}}
          name="cell"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
         />
      </form>
  )
}