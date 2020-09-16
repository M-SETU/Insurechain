
import React from 'react';


const PolicyCardVendor = props => (
    <tr>
      <td data-label="policyid" style={{textAlign:"center"}}>{props.policyCard[0]}</td>
      <td data-label="custID" style={{textAlign:"center"}}>{props.policyCard[2]}</td>
      <td data-label="name" style={{textAlign:"center"}}>{props.policyCard[7]}</td>
      <td data-label="poltype" style={{textAlign:"center"}}>{props.policyCard[4]}</td>
      <td data-label="hash" style={{textAlign:"center"}}>
        <a href={`https://ipfs.infura.io/ipfs/${props.policyCard[3]}`}>View Document</a>
      </td>
      <td data-label="appType" style={{textAlign:"center"}}>{props.policyCard[8]}</td>
    </tr>
  )

  export default PolicyCardVendor;