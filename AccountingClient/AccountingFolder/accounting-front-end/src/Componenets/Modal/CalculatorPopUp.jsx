import React from 'react';
import './CalculatorPopUp.css';
import { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';

const CalculatorPopUp = () => {

    const [display, setDisplay] = useState(''); // To track what's being typed/displayed

  // Handle input when user clicks a button
  const handleInput = (value) => {
    setDisplay((prev) => prev + value);
  };

  // Clear the display
  const clearDisplay = () => {
    setDisplay('');
  };

  
  const calculateResult = () => {
    try {
      setDisplay(eval(display).toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  return (
    
    <div className='calculator-container'>
      <div className='calculator-display'>
        <input type="text" value={display} readOnly className='calculator-input' />
      </div>
      <div className='calculator-buttons'>
        {/* Calculator Buttons */}
        <button onClick={() => handleInput('7')}>7</button>
        <button onClick={() => handleInput('8')}>8</button>
        <button onClick={() => handleInput('9')}>9</button>
        <button onClick={() => handleInput('/')}>/</button>
        <button onClick={() => handleInput('4')}>4</button>
        <button onClick={() => handleInput('5')}>5</button>
        <button onClick={() => handleInput('6')}>6</button>
        <button onClick={() => handleInput('*')}>*</button>
        <button onClick={() => handleInput('1')}>1</button>
        <button onClick={() => handleInput('2')}>2</button>
        <button onClick={() => handleInput('3')}>3</button>
        <button onClick={() => handleInput('-')}>-</button>
        <button onClick={() => clearDisplay()}>C</button>
        <button onClick={() => handleInput('0')}>0</button>
        <button onClick={calculateResult}>=</button>
        <button onClick={() => handleInput('+')}>+</button>
      </div>
    </div>
    
  );
};
export default CalculatorPopUp;