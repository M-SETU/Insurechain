pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";

contract cryptoPolicy is ERC721{

    struct policy {
        uint256 policyId;
        address owner;
        uint256 customerId;
        string kycHash;
        string policyType;
        uint256[2][] claimIds;
        string[2][] claimsDetails;
        bool active;
        string typeOfApplication;
        uint256 periodOfIssuance;
    }

    string[] policyTypes;
    uint256[] allPolicyIds;
    mapping(address => uint256[]) public userPolicies;
    mapping(address => uint256) public userCustomerId;
    mapping(uint256 => policy) public policies;
    address public admin;
    uint256 private nonce;
    
    constructor(string memory _name, string memory _symbol)
        public
        ERC721(_name, _symbol)
    { 
        admin = msg.sender;
        policyTypes.push("Affinity Plan");
        policyTypes.push("Essential Plan");
        policyTypes.push("Wellness Plan");
        // policyTypes.push("Gold 80 Community Care");
        // policyTypes.push("Platinum 90 Community Care");
        // policyTypes.push("Silver Value Enhanced Care");
        // policyTypes.push("Minimum Coverage Enhanced Care");
    }

    function getPolicyTypes() public view returns (string[] memory) {
        return policyTypes;
    }
    
    function getOwner() public view returns (address) {
        return admin;
    }

    function getPolicyIds() public view returns (uint256[] memory) {
        require(msg.sender == admin, "only admin");
        return allPolicyIds;
    }

    function getUserPolicies(address _address) public view returns (uint256[] memory) {
        require(msg.sender == _address);
        return userPolicies[_address];
    }

    function getUserCustomerId(address _address) public view returns (uint256) {
        require(msg.sender == _address);
        return userCustomerId[_address];
    }

    function getPolicy(uint256 _policyId) public view returns (policy memory) {
        if(msg.sender==admin || msg.sender == policies[_policyId].owner){
            return policies[_policyId];
        }
        else{
            revert("Not Owner or Admin");
        }
    }

    function createPolicy(
        string calldata _documentHash,
        string calldata _policyType,
        uint256 _periodOfIssuance
    ) external returns (uint256) {
        uint256 policyId = uint256(
            keccak256(abi.encodePacked(now, msg.sender, nonce))
        ) % 100000;
        nonce++;
        if(userCustomerId[msg.sender] == 0){
            uint256 custId = uint256(
                keccak256(abi.encodePacked(now, msg.sender, nonce))
            ) % 100000;
            custId =custId + 1;
            userCustomerId[msg.sender]=custId;
            nonce++;
        }
        
        policyId = policyId + 1;
        policyId = 20200000 + policyId;

        policies[policyId].customerId = userCustomerId[msg.sender];
        userPolicies[msg.sender].push(policyId);
        policies[policyId].policyId = policyId;
        policies[policyId].owner = msg.sender;
        policies[policyId].kycHash = _documentHash;
        policies[policyId].active = true;
        policies[policyId].policyType = _policyType;
        policies[policyId].periodOfIssuance = _periodOfIssuance;
        policies[policyId].typeOfApplication = "New Policy";
        allPolicyIds.push(policyId);
        _mint(msg.sender, policyId);
        return policyId;
    }
    
    function burn(uint256 _policyId) external {
        require(msg.sender == admin);
        policies[_policyId].active = false;
        _burn(_policyId);
    }

    function claimPolicy(
        uint256 _policyId,
        string memory _documentHash
    ) external {
        require(userCustomerId[msg.sender] == policies[_policyId].customerId);
        uint256 id = uint256(
            keccak256(abi.encodePacked(now, msg.sender, nonce))
        ) % 100000;
        id = id + 1;
        nonce++;
        policies[_policyId].claimIds.push([id, _policyId]);
        policies[_policyId].claimsDetails.push([_documentHash, "Unprocessed"]);
    }

    function actionClaim(uint256 _claimId, uint256 _policyId, string memory _action) external {
        require(msg.sender == admin, "only admin");
        for (uint i = 0; i < policies[_policyId].claimIds.length; i++){
            if(policies[_policyId].claimIds[i][0]==_claimId){
                policies[_policyId].claimsDetails[i][1] = _action;
                break;
            }
        }
    }
    
    function addPortData(
        address _owner,
        uint256 _policyId,
        string memory _kycHash,
        string memory _policyType,
        string memory _typeOfApplication,
        uint256[2][] memory _claimIds,
        string[2][] memory _claimDetails,
        uint256 _periodOfIssuance
    ) external{
        require(msg.sender == admin);
        if(userCustomerId[_owner] == 0){
            uint256 custId = uint256(
                keccak256(abi.encodePacked(now, _owner, nonce))
            ) % 100000;
            custId =custId + 1;
            userCustomerId[_owner]=custId;
            nonce++;
        }
        _policyId = _policyId%100000;
        _policyId = 20200000 + _policyId;
        
        policies[_policyId].customerId = userCustomerId[_owner];
        userPolicies[_owner].push(_policyId);
        policies[_policyId].policyId = _policyId;
        policies[_policyId].owner = _owner;
        policies[_policyId].kycHash = _kycHash;
        policies[_policyId].active = true;
        policies[_policyId].policyType = _policyType;
        policies[_policyId].typeOfApplication = _typeOfApplication;
        policies[_policyId].periodOfIssuance = _periodOfIssuance;
        policies[_policyId].claimIds = _claimIds;
        policies[_policyId].claimsDetails = _claimDetails;
        allPolicyIds.push(_policyId);
        _mint(_owner, _policyId);
    }
    
}
