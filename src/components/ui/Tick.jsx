import React from 'react'

const Tick = () => {
    return (
        <div class="tick-container">
            <svg xmlns="http://www.w3.org/2000/svg" class="svg-success" viewBox="0 0 24 24">
                <g stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10">
                    <circle class="success-circle-outline" cx="12" cy="12" r="11.5" />
                    <circle class="success-circle-fill" cx="12" cy="12" r="11.5" fill='none' />
                    <polyline class="success-tick" points="17,8.5 9.5,15.5 7,13" />
                </g>
            </svg>
        </div>
    )
}

export default Tick