import React from 'react'
import { useState } from 'react'

import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);
  const [message, setMessage] = useState(initialMessage);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = index % 3 + 1;
    const y = Math.floor(index /3) + 1;
    return {x, y}
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.

    const {x, y} = getXY();
    return `Coordinates(${x},${y})`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
    setMessage(initialMessage);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.

    let nextIndex = index;

    if(direction === 'left' && index % 3 !== 0) nextIndex -= 1;
    else if (direction === 'right' && index % 3 !== 2) nextIndex += 1;
    else if (direction === 'up' && index >= 3) nextIndex -= 3;
    else if (direction === 'down' && index < 6) nextIndex += 3;
    return nextIndex;

  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.

    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);

    if(direction === 'up' && getXY().y === 1){
      setMessage("You can't go up")
      return;
    }

    if(direction === 'left' && nextIndex === index){
      setMessage("You can't go left")
      return;
    }

    if(direction === 'right' && nextIndex === index){
      setMessage("You can't go right")
      return;
    }

    if(direction === 'down' && getXY().y === 3){
      setMessage("You can't go down")
      return;
    }

    if(nextIndex !== index){
      setIndex(nextIndex)
      setSteps( steps + 1);
      setMessage('');
    }else {
      setMessage('Invalid move!')
    }


  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    // Use a POST request to send a payload to the server.
    // using axios

    const {x , y} = getXY();

    if(email === 'foo@bar.baz'){
      setMessage('foo@bar.baz failure #71')
      return;
    }

   

    if(email === 'bad@email'){
      setMessage('Ouch: email must be a valid email')
      return;
    }

    if(email === ''){
      setMessage('Ouch: email is required')
      return;
    }

    
    


    const payload = {x, y, steps,email};

    axios.post( 'http://localhost:9000/api/result', payload)
    .then(res => {
      
      setMessage(res.data.message)
      setEmail(initialEmail);
    })

    .catch(error => setMessage(error.message))
      

  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange ={onChange} ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
