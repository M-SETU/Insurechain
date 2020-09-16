
import React from 'react';


const ClaimCardVendor = props => (
    <tr>
      <td>{props.claimCard[0]}</td>
      <td>{props.claimCard[7]}</td>
      <td>{props.claimCard[1]}</td>
      <td>{props.claimCard[2]}</td>
      <td>{props.claimCard[3]}</td>
      <td data-label="hash">
        <a href={`https://ipfs.infura.io/ipfs/${props.claimCard[5]}`}>{props.claimCard[5]}</a>
      </td>
      <td>{props.claimCard[4]}</td>
      <td>{props.claimCard[6]}</td>
      { 
        props.handleClaimButton(props.claimCard[0], props.claimCard[6])
      }
  
    </tr>
  )


export default ClaimCardVendor;