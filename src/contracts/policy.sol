pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import "./ERC721Token.sol";

contract cryptoPolicy is ERC721 {
    //0xF601fc2817Df7A3232bC177214B6C01c32e0978a

    struct claim {
        uint256 claimId;
        uint256 claimDate;
        string hospitalName;
        string description;
        uint256 amount;
        string claimDocumentHash;
        string status;
    }

    struct policy {
        uint256 policyId;
        address owner;
        uint256 customerId;
        string kycHash;
        string policyType;
        uint256[] claimIds;
    }

    string[] policyTypes;
    uint256[] allPolicyIds;
    uint256[] allClaimIds;
    mapping(address => uint256) public userPolicies;
    mapping(address => uint256) public userCustomerId;
    mapping(uint256 => policy) public policies;
    mapping(uint256 => claim) public claims;
    address public admin;
    uint256 private nonce;

    constructor(string memory _name, string memory _symbol)
        public
        ERC721(_name, _symbol)
    {
        admin = msg.sender;
        policyTypes.push("SmartLife");
        policyTypes.push("360Cover");
        policyTypes.push("PersonalProtect");
        policyTypes.push("FamilySure");
    }

    function createPolicyType(string memory _policyType) public {
        require(msg.sender == admin, "only admin");
        policyTypes.push(_policyType);
    }

    function getPolicyTypes() public view returns (string[] memory) {
        return policyTypes;
    }

    function getPolicyIds() public view returns (uint256[] memory) {
        require(msg.sender == admin, "only admin");
        return allPolicyIds;
    }

    function getUserPolicies(address _address) public view returns (uint256) {
        require(msg.sender == _address);
        return userPolicies[_address];
    }

    function getUserCustomerId(address _address) public view returns (uint256) {
        require(msg.sender == _address);
        return userCustomerId[_address];
    }

    function getPolicy(uint256 _policyId) public view returns (policy memory) {
        if (msg.sender == admin || msg.sender == policies[_policyId].owner) {
            return policies[_policyId];
        } else {
            revert("Not Owner or Admin");
        }
    }

    function getClaim(uint256 _claimId) public view returns (claim memory) {
        return claims[_claimId];
    }

    function getAllClaimIds() public view returns (uint256[] memory) {
        require(msg.sender == admin, "only admin");
        return allClaimIds;
    }

    function getUserPolicyClaimIds(uint256 _policyId)
        public
        view
        returns (uint256[] memory)
    {
        require(msg.sender == policies[_policyId].owner);
        return policies[_policyId].claimIds;
    }

    function createPolicy(
        string calldata _documentHash,
        string calldata _policyType
    ) external {
        if (userCustomerId[msg.sender] == 0) {
            uint256 randomnumber = uint256(
                keccak256(abi.encodePacked(now, msg.sender, nonce))
            ) % 100000;
            randomnumber = randomnumber + 1;
            nonce++;
            userCustomerId[msg.sender] = randomnumber;
        }
        uint256 policyId = uint256(
            keccak256(abi.encodePacked(now, msg.sender, nonce))
        ) % 100000;
        policyId = policyId + 1;
        nonce++;

        policies[policyId].customerId = userCustomerId[msg.sender];
        userPolicies[msg.sender] = policyId;
        policies[policyId].policyId = policyId;
        policies[policyId].owner = msg.sender;
        policies[policyId].kycHash = _documentHash;
        policies[policyId].policyType = _policyType;
        allPolicyIds.push(policyId);
        _mint(msg.sender, policyId);
    }

    function claimPolicy(
        uint256 _policyId,
        uint256 _claimDate,
        string calldata _hospitalName,
        string calldata _description,
        uint256 _amount,
        string calldata _claimdocs
    ) external {
        require(userCustomerId[msg.sender] == policies[_policyId].customerId);

        uint256 id = uint256(
            keccak256(abi.encodePacked(now, msg.sender, nonce))
        ) % 100000;
        id = id + 1;
        nonce++;

        claims[id] = claim(
            id,
            _claimDate,
            _hospitalName,
            _description,
            _amount,
            _claimdocs,
            "unprocessed"
        );
        policies[_policyId].claimIds.push(id);
        allClaimIds.push(id);
    }

    function approveClaim(uint256 _claimId) external {
        require(msg.sender == admin, "only admin");
        claims[_claimId].status = "Approved";
    }

    function rejectClaim(uint256 _claimId) external {
        require(msg.sender == admin, "only admin");
        claims[_claimId].status = "Rejected";
    }
}
