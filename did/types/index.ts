export interface DIDDocument {
  '@context': string[];
  id: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod?: string[];
  keyAgreement?: string[];
  capabilityInvocation?: string[];
  capabilityDelegation?: string[];
  service?: ServiceEndpoint[];
  created?: string;
  updated?: string;
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase?: string;
  publicKeyJwk?: JsonWebKey;
  ethereumAddress?: string;
  blockchainAccountId?: string;
}

export interface ServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string | string[];
  description?: string;
}

export interface DIDUser {
  did: string;
  address: string;
  document: DIDDocument;
  createdAt: Date;
  updatedAt?: Date;
  isVerified: boolean;
  reputation?: ReputationLink;
}

export interface ReputationLink {
  score: number;
  verified: boolean;
  lastUpdated: Date;
  trustBlockProfile: string;
}

export interface DIDResolutionResult {
  didDocument: DIDDocument | null;
  didResolutionMetadata: {
    contentType?: string;
    error?: string;
  };
  didDocumentMetadata: {
    created?: string;
    updated?: string;
    deactivated?: boolean;
    versionId?: string;
  };
}

export interface DIDAuthChallenge {
  challenge: string;
  timestamp: number;
  expiresAt: number;
  nonce: string;
}

export interface DIDCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: Record<string, any>;
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
  };
}

export type DIDMethod = 'ethr' | 'substrate' | 'web';
export type VerificationType = 'EcdsaSecp256k1VerificationKey2019' | 'Ed25519VerificationKey2018' | 'RsaVerificationKey2018';