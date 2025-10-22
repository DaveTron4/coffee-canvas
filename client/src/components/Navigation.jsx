import React from 'react'
import '../App.css'
import '../css/Navigation.css'

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li><h1>Coffee Canvas</h1></li>
            </ul>

            <ul>
                <li><a href='/' role='button'>Make Coffee</a></li>
                <li><a href='/coffees' role='button'>View Coffees</a></li>
            </ul>
            
        </nav>
    )
}

export default Navigation