export const DID_CONFIG = {
  method: 'ethr',
  network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
  registryAddress: process.env.NEXT_PUBLIC_DID_REGISTRY || '0x...',
  resolverUrl: process.env.NEXT_PUBLIC_DID_RESOLVER || 'https://uniresolver.io'
};

export const DID_REGISTRY_ABI = [
  "function updateDIDDocument(string memory did, string memory document) public",
  "function getDIDDocument(string memory did) public view returns (string memory)",
  "function getDIDOwner(string memory did) public view returns (address)",
  "function getDIDVersion(string memory did) public view returns (uint256)",
  "event DIDDocumentUpdated(string indexed did, uint256 version, address indexed owner)"
];

export const DID_METHODS = {
  ETHEREUM: 'ethr',
  POLKADOT: 'substrate'
} as const;

export const VERIFICATION_TYPES = {
  ECDSA_SECP256K1: 'EcdsaSecp256k1VerificationKey2019',
  ED25519: 'Ed25519VerificationKey2018',
  RSA: 'RsaVerificationKey2018'
} as const;