import React from 'react';


const ClaimCardUser = props => {
return(<tr>
      <td style={{textAlign:"center"}}>{props.claimCard[0]}</td>
      <td style={{textAlign:"center"}}>{props.claimCard[7]}</td>
      <td style={{textAlign:"center"}}>{props.claimCard[1]}</td>
      <td style={{textAlign:"center"}}>{props.claimCard[2]}</td>
      <td style={{textAlign:"center"}}>{props.claimCard[3]}</td>
      <td data-label="hash" style={{textAlign:"center"}}>
        <a href={`https://ipfs.infura.io/ipfs/${props.claimCard[5]}`}>View Document</a>
      </td>
      <td style={{textAlign:"center"}}>{props.claimCard[4]}</td>
      <td style={{textAlign:"center"}}>{props.claimCard[6]}</td>
    </tr>);
}

export default ClaimCardUser;
  