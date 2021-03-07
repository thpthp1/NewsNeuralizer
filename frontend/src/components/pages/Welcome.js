import React from 'react'
import '../../App.css';
import { Button } from '../Button';
import './Welcome.css'

function Welcome() {
    return (
        <div className='welcome-container'>
            {/* <video src="/videos/video-2.mp4" autoPlay loop muted /> */}
            <img src="./images/welcome-1.jpg" alt="Newspaper" />
            <h1>News Neuralizer</h1>
            <p>Fake News Analyzer</p>
            <div className="welcome-btns">
                <Button
                    className='btns'
                    buttonStyle='btn--outline'
                    buttonSize='btn--large'>
                    GET STARTED
                    </Button>
            </div>
        </div>
    )
}

export default Welcome;
