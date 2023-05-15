import "styles/views/HomeHeader.scss";
import React,{useState} from 'react';
import "styles/views/PopUp.scss";
import Triangle from "images/Triangle.png";
import PropTypes from "prop-types";
import "styles/ui/DropDown.scss";

const DropDown = props => {

    const dropDown = () =>{
        if(props.show){
            return(
                <>
                    <div onClick={() => {props.setShow(false)}} className="profile-background"></div>
                    <div style={{top:`${props.yOffset}px`}} className={`wrapper ${props.centered ? "centered" : ''}`}>
                        <img className='Triangle' src={Triangle}></img>
                        {props.children}
                    </div>
                </>
            )
        }
    }

    return (
        <>
            {dropDown()}
        </>
    );
};

DropDown.propTypes = {
    show: PropTypes.bool,
    setShow: PropTypes.func,
    centered: PropTypes.bool,
    yOffset: PropTypes.number
};

export default DropDown;
