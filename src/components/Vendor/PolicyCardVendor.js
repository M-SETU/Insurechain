
import React from 'react';


const PolicyCardVendor = props => (
    <tr>
      <td data-label="policyID" style={{textAlign:"center"}}>{props.policyCard[0]}</td>
      <td data-label="custID" style={{textAlign:"center"}}>{props.policyCard[2]}</td>
      <td data-label="personal details">
        <strong>Name: </strong>{props.policyCard[3]["name"]} <br/>
        <strong>Email: </strong>{props.policyCard[3]["email"]} <br/>
        <strong>Date of Birth: </strong>{props.policyCard[3]["dateOfBirth"]} <br/>
        <strong>Mobile Number: </strong>{props.policyCard[3]["mobileNumber"]} <br/>
        <strong>Address: </strong>{props.policyCard[3]["personalAddress"]} <br/>
        <strong>PAN: </strong>{props.policyCard[3]["pan"]} <br/>
        <strong>KYC Documents: </strong><a href={`https://${props.policyCard[3]["kycHash"]}.ipfs.infura-ipfs.io`}>View Document</a>
      </td>
      <td data-label="polDetails">
        <strong>Policy Type: </strong>{props.policyCard[4]} <br/>
        <strong>Period of Issuance: </strong>{props.policyCard[9]+' Years'} <br/>
        <strong>Application Type: </strong>{props.policyCard[8]} <br/>
        <strong>Date of Issuance: </strong>{props.policyCard[3]["dateOfIssuance"]} <br/>
        <strong>Type: </strong>{props.policyCard[3]["type"]} <br/>
        <strong>Sum of Issuance: </strong>{'Rs.'+props.policyCard[3]["sumOfIssuance"]} <br/>
        <strong>Cummulative Bonus: </strong>{'Rs.'+props.policyCard[10]} <br/>
      </td>
      <td data-label="medicalHistory">
        <strong>Pre-Existing Disease: </strong>{props.policyCard[3]["preDisease"]} <br/>
        <strong>Medication: </strong>{props.policyCard[3]["medication"]} <br/>
        <strong>Medical Procedures: </strong>{props.policyCard[3]["medicationProcedures"]} <br/>
        <strong>Medical Test Records: </strong><a href={`https://${props.policyCard[3]["medicalHash"]}.ipfs.infura-ipfs.io`}>View Document</a>
      </td>
    </tr>
  )

  export default PolicyCardVendor;