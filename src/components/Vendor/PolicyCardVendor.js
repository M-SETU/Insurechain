
import React from 'react';


const PolicyCardVendor = props => (
    <tr>
      <td data-label="policyid">{props.policyCard[0]}</td>
      <td data-label="custID">{props.policyCard[2]}</td>
      <td data-label="poltype">{props.policyCard[4]}</td>
      <td data-label="hash">
        <a href={`https://ipfs.infura.io/ipfs/${props.policyCard[3]}`}>View Document</a>
      </td>
      <td>
        <a href={`https://mumbai-explorer.matic.today/tx/${localStorage.getItem('mintHash')}/token_transfers`} target="_blank">Hash</a>
      </td>
    </tr>
  )

  export default PolicyCardVendor;