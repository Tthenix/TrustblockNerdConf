// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DIDRegistry
 * @dev A simple registry for storing and managing Decentralized Identifiers (DIDs)
 * and their associated DID Documents on the Ethereum blockchain.
 */
contract DIDRegistry {
    
    struct DIDInfo {
        string document;
        address owner;
        uint256 version;
        uint256 created;
        uint256 updated;
        bool exists;
    }
    
    mapping(string => DIDInfo) private didInfos;
    mapping(address => string[]) private ownerDIDs;
    
    event DIDDocumentUpdated(
        string indexed did, 
        uint256 version, 
        address indexed owner,
        uint256 timestamp
    );
    
    event DIDOwnershipTransferred(
        string indexed did,
        address indexed previousOwner,
        address indexed newOwner
    );
    
    modifier onlyDIDOwner(string memory did) {
        require(didInfos[did].exists, "DID does not exist");
        require(didInfos[did].owner == msg.sender, "Not the DID owner");
        _;
    }
    
    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }
    
    /**
     * @dev Updates or creates a DID document
     * @param did The DID identifier
     * @param document The DID document as JSON string
     */
    function updateDIDDocument(
        string memory did, 
        string memory document
    ) public {
        require(bytes(did).length > 0, "DID cannot be empty");
        require(bytes(document).length > 0, "Document cannot be empty");
        
        if (!didInfos[did].exists) {
            // Create new DID
            didInfos[did] = DIDInfo({
                document: document,
                owner: msg.sender,
                version: 1,
                created: block.timestamp,
                updated: block.timestamp,
                exists: true
            });
            
            // Add to owner's DID list
            ownerDIDs[msg.sender].push(did);
        } else {
            // Update existing DID (only owner can update)
            require(didInfos[did].owner == msg.sender, "Not the DID owner");
            
            didInfos[did].document = document;
            didInfos[did].version++;
            didInfos[did].updated = block.timestamp;
        }
        
        emit DIDDocumentUpdated(
            did, 
            didInfos[did].version, 
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Gets the DID document
     * @param did The DID identifier
     * @return The DID document as JSON string
     */
    function getDIDDocument(string memory did) public view returns (string memory) {
        require(didInfos[did].exists, "DID does not exist");
        return didInfos[did].document;
    }
    
    /**
     * @dev Gets the owner of a DID
     * @param did The DID identifier
     * @return The owner address
     */
    function getDIDOwner(string memory did) public view returns (address) {
        require(didInfos[did].exists, "DID does not exist");
        return didInfos[did].owner;
    }
    
    /**
     * @dev Gets the version of a DID document
     * @param did The DID identifier
     * @return The current version number
     */
    function getDIDVersion(string memory did) public view returns (uint256) {
        require(didInfos[did].exists, "DID does not exist");
        return didInfos[did].version;
    }
    
    /**
     * @dev Gets complete DID information
     * @param did The DID identifier
     * @return document The DID document
     * @return owner The owner address
     * @return version The current version
     * @return created Creation timestamp
     * @return updated Last update timestamp
     */
    function getDIDInfo(string memory did) public view returns (
        string memory document,
        address owner,
        uint256 version,
        uint256 created,
        uint256 updated
    ) {
        require(didInfos[did].exists, "DID does not exist");
        DIDInfo memory info = didInfos[did];
        return (info.document, info.owner, info.version, info.created, info.updated);
    }
    
    /**
     * @dev Checks if a DID exists
     * @param did The DID identifier
     * @return True if the DID exists
     */
    function didExists(string memory did) public view returns (bool) {
        return didInfos[did].exists;
    }
    
    /**
     * @dev Gets all DIDs owned by an address
     * @param owner The owner address
     * @return Array of DID strings
     */
    function getOwnerDIDs(address owner) public view returns (string[] memory) {
        return ownerDIDs[owner];
    }
    
    /**
     * @dev Transfers ownership of a DID
     * @param did The DID identifier
     * @param newOwner The new owner address
     */
    function transferDIDOwnership(
        string memory did, 
        address newOwner
    ) public onlyDIDOwner(did) validAddress(newOwner) {
        address previousOwner = didInfos[did].owner;
        didInfos[did].owner = newOwner;
        didInfos[did].updated = block.timestamp;
        didInfos[did].version++;
        
        // Remove from previous owner's list
        _removeDIDFromOwner(previousOwner, did);
        
        // Add to new owner's list
        ownerDIDs[newOwner].push(did);
        
        emit DIDOwnershipTransferred(did, previousOwner, newOwner);
    }
    
    /**
     * @dev Deactivates a DID (only owner can deactivate)
     * @param did The DID identifier
     */
    function deactivateDID(string memory did) public onlyDIDOwner(did) {
        // Mark as deactivated by clearing the document but keeping metadata
        didInfos[did].document = "";
        didInfos[did].updated = block.timestamp;
        didInfos[did].version++;
        
        emit DIDDocumentUpdated(did, didInfos[did].version, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Internal function to remove DID from owner's list
     * @param owner The owner address
     * @param did The DID to remove
     */
    function _removeDIDFromOwner(address owner, string memory did) internal {
        string[] storage dids = ownerDIDs[owner];
        for (uint i = 0; i < dids.length; i++) {
            if (keccak256(bytes(dids[i])) == keccak256(bytes(did))) {
                dids[i] = dids[dids.length - 1];
                dids.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Gets the total number of DIDs in the registry
     * @return The total count
     */
    function getTotalDIDs() public view returns (uint256) {
        // Note: This is a simplified implementation
        // In production, you might want to maintain a separate counter
        return 0; // Placeholder - would need additional state tracking
    }
}