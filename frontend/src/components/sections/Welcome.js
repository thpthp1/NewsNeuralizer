import React from 'react'
import '../../App.css';
import './Welcome.css'

function Welcome() {
    return (
        <div className='welcome-container'>
            <video src="./videos/intro-bg.mp4" autoPlay loop muted />
            <h1>News Neuralizer</h1>
            <p>Easy News Bias Prediction</p>
        </div>
    )
}

export default Welcome;
