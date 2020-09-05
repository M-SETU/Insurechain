import React from 'react';

const PolicyOptions = props => {
    return(
    <option value={props.opt}>
      {props.opt}
    </option>
  )
}

export default PolicyOptions;