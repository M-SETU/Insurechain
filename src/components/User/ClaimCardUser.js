import React from 'react';

const ClaimCardUser = props => {

  return(<tr>
      <td style={{textAlign:"center"}}>{props.claimCard[0]}</td>
      <td style={{textAlign:"center"}}>{props.claimCard[1]}</td>
      <td data-label="claimDetails">
        <strong>Claim Date: </strong>{props.claimCard[2]["claimDate"]} <br/>
        <strong>Hospital Name: </strong>{props.claimCard[2]["hospitalName"]} <br/>
        <strong>Description: </strong>{props.claimCard[2]["description"]} <br/>
        <strong>Claim Amount: </strong>{"Rs." + props.claimCard[2]["amount"]} <br/>
        <strong>Claim Documents: </strong><a href={`https://${props.claimCard[2]["claimHash"]}.ipfs.infura-ipfs.io`}>View Document</a>
      </td>
      <td style={{textAlign:"center"}}>{props.claimCard[3]}</td>
    </tr>);
}

export default ClaimCardUser;
  