import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Button'
import './ArticleForm.css'
import Verdict from './Verdict.js'

function ArticleForm() {

    const [showVerdict, setShowVerdict] = React.useState(false)

    function handleSubmit(event) {
        event.preventDefault()
        setShowVerdict(true)
    }
    return (
        <div className="article-form-container">
            <section className="article-form-input">
                <p className="article-form-input-heading">
                    Enter the article information
                </p>
                <div className="input-areas">
                    <form onSubmit={handleSubmit}>
                        <input  
                            name="article" 
                            placeholder="Article URL"
                            className="article-form-input"
                        />
                        <input  
                            name="title" 
                            placeholder="Article Title"
                            className="article-form-input"
                        />
                        <textarea  
                            name="body" 
                            placeholder="Article Body Text"
                            className="article-form-input"
                        />
                        <Button buttonStyle='btn--outline' type="submit">Neuralize</Button>
                    </form>
                </div>
            </section>
            { showVerdict ? <Verdict /> : null }
        </div>
    )
}

export default ArticleForm
