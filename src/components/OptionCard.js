import React from 'react';

const OptionCard = props => {
 return[<option value={props.opt}>
      {props.opt}
    </option>];
}

  export default OptionCard;