import PropTypes from "prop-types";
import "styles/ui/SelectionButton.scss";

export const SelectionButton = props => {
    return(    
    <div className="selection-button container" style={{background: `url(${props.url})`}}>
        <p className="title">{props.title}</p>
    </div>);
}

SelectionButton.propTypes = {
    title: PropTypes.string,
    url: PropTypes.string,
    class: PropTypes.string
};