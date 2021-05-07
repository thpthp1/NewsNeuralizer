import React from 'react'
import '../../App.css';
import { Button } from '../Button';
import './Welcome.css'

function Welcome() {
    return (
        <div className='welcome-container'>
            <video src="./videos/intro-bg.mp4" autoPlay loop muted />
            <h1>News Neuralizer</h1>
            <p>Easy Fake News Prediction</p>
        </div>
    )
}

export default Welcome;
