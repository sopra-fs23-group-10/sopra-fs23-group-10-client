import PropTypes from "prop-types";
import "styles/ui/FormField.scss";

export const FormField = props => {
    return (
      <div className="field">
        <label className="label">
          {props.label}
        </label>
        <input
          type={props.type}
          className="input"
          placeholder="enter here.."
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      </div>
    );
  };
  
FormField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};