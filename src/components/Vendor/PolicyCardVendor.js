
import React from 'react';


const PolicyCardVendor = props => (
    <tr>
      <td data-label="policyID" style={{textAlign:"center"}}>{props.policyCard[0]}</td>
      <td data-label="custID" style={{textAlign:"center"}}>{props.policyCard[2]}</td>
      <td data-label="name" style={{textAlign:"center"}}>{props.policyCard[3]["name"]}</td>
      <td data-label="emailId" style={{textAlign:"center"}}>{props.policyCard[3]["email"]}</td>
      <td data-label="poltype" style={{textAlign:"center"}}>{props.policyCard[4]}</td>
      <td data-label="hash" style={{textAlign:"center"}}>
        <a href={`https://${props.policyCard[3]["kycHash"]}.ipfs.infura-ipfs.io`}>View Document</a>
      </td>
      <td data-label="appType" style={{textAlign:"center"}}>{props.policyCard[8]}</td>
    </tr>
  )

  export default PolicyCardVendor;