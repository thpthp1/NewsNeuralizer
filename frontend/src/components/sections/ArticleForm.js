import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Button'
import './ArticleForm.css'

function ArticleForm() {
    return (
        <div className="article-form-container">
            <section className="article-form-input">
                <p className="article-form-input-heading">
                    Enter the article information
                </p>
                <div className="input-areas">
                    <form>
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
                        <Button buttonStyle='btn--outline'>Neuralize</Button>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default ArticleForm
