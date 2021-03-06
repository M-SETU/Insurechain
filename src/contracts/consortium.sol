// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract consortiumPolicy{
    
    struct portPolicy {
        uint256 policyId;
        string details;
        address oldVendor;
        address newVendor;
        string policyType;
        address owner;
        string status;
        string reason;
    }
    
    uint256[] allPortIds;
    mapping(uint256 => portPolicy) public allPortRequests;
    
    function getAllIds() public view returns(uint256[] memory){
        return allPortIds;
    }
    
    function getPortPolicyDetails(uint256 _policyId) public view returns(portPolicy memory){
        if(msg.sender == allPortRequests[_policyId].owner || msg.sender == allPortRequests[_policyId].newVendor || msg.sender == allPortRequests[_policyId].oldVendor){
            return allPortRequests[_policyId];
        }
        else{
            revert("Not Owner or Admin");
        }
    }
    
    function requestPort(uint256 _policyId, address _oldVendor, address _newVendor, string memory _policyType, string memory _reason) external {
        allPortIds.push(_policyId);
        allPortRequests[_policyId].policyId = _policyId;
        allPortRequests[_policyId].oldVendor = _oldVendor;
        allPortRequests[_policyId].newVendor = _newVendor;
        allPortRequests[_policyId].owner = msg.sender;
        allPortRequests[_policyId].policyType = _policyType;
        allPortRequests[_policyId].reason = _reason;
        allPortRequests[_policyId].status = "Application Submitted";
    }
    
    function requestDetails(uint _policyId) external {
        require(msg.sender == allPortRequests[_policyId].newVendor);
        allPortRequests[_policyId].status = "Request Initiated";
    }
    
    function sendDetails(uint _policyId, string memory _details) external {
        require(msg.sender == allPortRequests[_policyId].oldVendor);
        allPortRequests[_policyId].details = _details;
        allPortRequests[_policyId].status = "Details Sent";
    }
    
    function approveDetails(uint256 _policyId) external {
        require(msg.sender == allPortRequests[_policyId].newVendor);
        allPortRequests[_policyId].status = "Approved";
    }
    
    function deleteRequest(uint256 _policyId) external {
        require(msg.sender == allPortRequests[_policyId].oldVendor || msg.sender == allPortRequests[_policyId].newVendor );
        delete allPortRequests[_policyId];
        for(uint i = 0; i<allPortIds.length; i++){
            if(allPortIds[i]==_policyId){
                delete allPortIds[i];
            }
        }
    }
    
}