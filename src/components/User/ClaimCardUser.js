import React from 'react';
import ipfs from '../ipfs.js'

const ClaimCardUser = props => {

  return(<tr>
      <td style={{textAlign:"center"}}>{props.claimCard[0]}</td>
      <td style={{textAlign:"center"}}>{props.claimCard[1]}</td>
      <td style={{textAlign:"center"}}>{props.claimCard[2]["claimDate"]}</td>
      <td style={{textAlign:"center"}}>{props.claimCard[2]["hospitalName"]}</td>
      <td style={{textAlign:"center"}}>{props.claimCard[2]["description"]}</td>
      <td style={{textAlign:"center"}}>{props.claimCard[2]["amount"]}</td>
      <td data-label="hash" style={{textAlign:"center"}}>
        <a href={`https://${props.claimCard[2]["claimHash"]}.ipfs.infura-ipfs.io`}>View Document</a>
      </td>
      <td style={{textAlign:"center"}}>{props.claimCard[3]}</td>
    </tr>);
}

export default ClaimCardUser;
  