import { ethers } from 'ethers';
import { DIDDocument, DIDAuthChallenge } from '../types';

/**
 * Validates a DID string format
 */
export function validateDIDFormat(did: string): boolean {
  const didRegex = /^did:[a-z0-9]+:[a-zA-Z0-9._:-]+$/;
  return didRegex.test(did);
}

/**
 * Extracts the address from an Ethereum DID
 */
export function extractAddressFromEthereumDID(did: string): string | null {
  const parts = did.split(':');
  if (parts.length >= 3 && parts[0] === 'did' && parts[1] === 'ethr') {
    return parts[parts.length - 1];
  }
  return null;
}

/**
 * Creates a DID from an Ethereum address
 */
export function createEthereumDID(address: string, network: string = 'mainnet'): string {
  return `did:ethr:${network}:${address}`;
}

/**
 * Validates a DID document structure
 */
export function validateDIDDocument(document: any): document is DIDDocument {
  if (!document || typeof document !== 'object') return false;
  
  const required = ['@context', 'id', 'verificationMethod', 'authentication'];
  for (const field of required) {
    if (!(field in document)) return false;
  }
  
  if (!Array.isArray(document['@context'])) return false;
  if (typeof document.id !== 'string') return false;
  if (!Array.isArray(document.verificationMethod)) return false;
  if (!Array.isArray(document.authentication)) return false;
  
  return true;
}

/**
 * Generates a cryptographically secure random nonce
 */
export function generateNonce(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks if an auth challenge has expired
 */
export function isAuthChallengeExpired(challenge: DIDAuthChallenge): boolean {
  return Date.now() > challenge.expiresAt;
}

/**
 * Creates a standardized auth challenge message
 */
export function createAuthChallengeMessage(
  address: string,
  timestamp: number,
  nonce: string,
  network: string = 'sepolia'
): string {
  return `TrustBlock DID Authentication Challenge
Address: ${address}
Timestamp: ${timestamp}
Nonce: ${nonce}
Network: ${network}
Please sign this message to authenticate your DID.`;
}

/**
 * Verifies a signature against a message and expected address
 */
export async function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): Promise<boolean> {
  try {
    const messageHash = ethers.hashMessage(message);
    const recoveredAddress = ethers.recoverAddress(messageHash, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * Formats a DID for display (truncates if too long)
 */
export function formatDIDForDisplay(did: string, maxLength: number = 40): string {
  if (did.length <= maxLength) return did;
  
  const start = Math.floor((maxLength - 3) / 2);
  const end = maxLength - 3 - start;
  
  return `${did.substring(0, start)}...${did.substring(did.length - end)}`;
}

/**
 * Formats an Ethereum address for display
 */
export function formatAddressForDisplay(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Validates an Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return ethers.isAddress(address);
}

/**
 * Converts timestamp to human-readable date
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Creates a service endpoint URL for TrustBlock
 */
export function createTrustBlockServiceEndpoint(address: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${base}/profile/${address}`;
}

/**
 * Extracts the network from a DID
 */
export function extractNetworkFromDID(did: string): string | null {
  const parts = did.split(':');
  if (parts.length >= 4 && parts[0] === 'did' && parts[1] === 'ethr') {
    return parts[2];
  }
  return null;
}

/**
 * Checks if two DIDs are equivalent
 */
export function areDIDsEquivalent(did1: string, did2: string): boolean {
  return did1.toLowerCase() === did2.toLowerCase();
}

/**
 * Sanitizes a DID document for storage
 */
export function sanitizeDIDDocument(document: DIDDocument): DIDDocument {
  return {
    ...document,
    '@context': Array.isArray(document['@context']) ? document['@context'] : [document['@context']],
    created: document.created || new Date().toISOString(),
    updated: new Date().toISOString()
  };
}

/**
 * Generates a verification method ID
 */
export function generateVerificationMethodId(did: string, keyIndex: number = 1): string {
  return `${did}#key-${keyIndex}`;
}

/**
 * Generates a service endpoint ID
 */
export function generateServiceId(did: string, serviceName: string): string {
  return `${did}#${serviceName}`;
}