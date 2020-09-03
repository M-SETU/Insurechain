pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";

contract cryptoPolicy is ERC721UpgradeSafe, GSNRecipientUpgradeSafe {
    struct claim {
        uint256 claimId;
        string claimDate;
        string hospitalName;
        string description;
        uint256 amount;
        string claimDocumentHash;
        string status;
        uint256 policyId;
    }

    struct policy {
        uint256 policyId;
        address owner;
        uint256 customerId;
        string kycHash;
        string policyType;
        uint256[] claimIds;
        bool active;
    }

    string[] policyTypes;
    uint256[] allPolicyIds;
    uint256[] allClaimIds;
    mapping(address => uint256[]) public userPolicies;
    mapping(address => uint256) public userCustomerId;
    mapping(uint256 => policy) public policies;
    mapping(uint256 => claim) public claims;
    address public admin;
    uint256 private non;

    constructor(string memory _name, string memory _symbol) public {
        __ERC721_init(_name, _symbol);
        admin = _msgSender();
        policyTypes.push("Smart");
        policyTypes.push("360");
        policyTypes.push("Personal");
        policyTypes.push("Family");
        uint256 randomnumber = uint256(
            keccak256(abi.encodePacked(now, _msgSender(), non))
        ) % 100000;
        randomnumber = randomnumber + 1;
        non++;
        userCustomerId[_msgSender()] = randomnumber;
    }

    function acceptRelayedCall(
        address relay,
        address from,
        bytes calldata encodedFunction,
        uint256 transactionFee,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 nonce,
        bytes calldata approvalData,
        uint256 maxPossibleCharge
    ) external override view returns (uint256, bytes memory) {
        // approve ALL calls!
        return _approveRelayedCall();
    }

    function _msgSender()
        internal
        override(ContextUpgradeSafe, GSNRecipientUpgradeSafe)
        view
        returns (address payable)
    {
        return GSNRecipientUpgradeSafe._msgSender();
    }

    function _msgData()
        internal
        override(ContextUpgradeSafe, GSNRecipientUpgradeSafe)
        view
        returns (bytes memory)
    {
        return GSNRecipientUpgradeSafe._msgData();
    }

    function _preRelayedCall(bytes memory context)
        internal
        override
        returns (bytes32)
    {}

    function _postRelayedCall(
        bytes memory context,
        bool,
        uint256 actualCharge,
        bytes32
    ) internal override {}

    function checkNewCustomer() public view returns (bool) {
        if (userCustomerId[_msgSender()] == 0) {
            return false;
        } else {
            return true;
        }
    }

    function createNewCustomer() external returns (uint256) {
        uint256 randomnumber = uint256(
            keccak256(abi.encodePacked(now, _msgSender(), non))
        ) % 100000;
        randomnumber = randomnumber + 1;
        non++;
        userCustomerId[_msgSender()] = randomnumber;
    }

    function createPolicyType(string memory _policyType) public {
        require(_msgSender() == admin, "only admin");
        policyTypes.push(_policyType);
    }

    function getPolicyTypes() public view returns (string[] memory) {
        return policyTypes;
    }

    function getOwner() public view returns (address) {
        return admin;
    }

    function getPolicyIds() public view returns (uint256[] memory) {
        require(_msgSender() == admin, "only admin");
        return allPolicyIds;
    }

    function getUserPolicies(address _address)
        public
        view
        returns (uint256[] memory)
    {
        require(_msgSender() == _address);
        return userPolicies[_address];
    }

    function getUserCustomerId(address _address) public view returns (uint256) {
        require(_msgSender() == _address);
        return userCustomerId[_address];
    }

    function getPolicy(uint256 _policyId) public view returns (policy memory) {
        if (
            _msgSender() == admin || _msgSender() == policies[_policyId].owner
        ) {
            return policies[_policyId];
        } else {
            revert("Not Owner or Admin");
        }
    }

    function getClaim(uint256 _claimId) public view returns (claim memory) {
        return claims[_claimId];
    }

    function getAllClaimIds() public view returns (uint256[] memory) {
        require(_msgSender() == admin, "only admin");
        return allClaimIds;
    }

    function getUserPolicyClaimIds(uint256 _policyId)
        public
        view
        returns (uint256[] memory)
    {
        require(_msgSender() == policies[_policyId].owner);
        return policies[_policyId].claimIds;
    }

    function createPolicy(
        string calldata _documentHash,
        string calldata _policyType
    ) external {
        uint256 policyId = uint256(
            keccak256(abi.encodePacked(now, _msgSender(), non))
        ) % 100000;
        policyId = policyId + 1;
        non++;

        policies[policyId].customerId = userCustomerId[_msgSender()];
        userPolicies[_msgSender()].push(policyId);
        policies[policyId].policyId = policyId;
        policies[policyId].owner = _msgSender();
        policies[policyId].kycHash = _documentHash;
        policies[policyId].active = true;
        policies[policyId].policyType = _policyType;
        allPolicyIds.push(policyId);
        _mint(_msgSender(), policyId);
    }

    function burn(uint256 _policyId) external {
        require(_msgSender() == policies[_policyId].owner);
        policies[_policyId].active = false;
    }

    function claimPolicy(
        uint256 _policyId,
        string calldata _claimDate,
        string calldata _hospitalName,
        string calldata _description,
        uint256 _amount,
        string calldata _claimdocs
    ) external {
        require(userCustomerId[_msgSender()] == policies[_policyId].customerId);
        uint256 id = uint256(
            keccak256(abi.encodePacked(now, _msgSender(), non))
        ) % 100000;
        id = id + 1;
        non++;
        claims[id] = claim(
            id,
            _claimDate,
            _hospitalName,
            _description,
            _amount,
            _claimdocs,
            "unprocessed",
            _policyId
        );
        policies[_policyId].claimIds.push(id);
        allClaimIds.push(id);
    }

    function approveClaim(uint256 _claimId) external {
        require(_msgSender() == admin, "only admin");
        claims[_claimId].status = "Approved";
    }

    function rejectClaim(uint256 _claimId) external {
        require(_msgSender() == admin, "only admin");
        claims[_claimId].status = "Rejected";
    }
}
