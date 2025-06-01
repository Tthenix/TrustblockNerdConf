import { ethers } from 'ethers';
import { DID_CONFIG, DID_REGISTRY_ABI, VERIFICATION_TYPES } from '../config/did.config';
import { 
  DIDDocument, 
  DIDUser, 
  DIDResolutionResult, 
  VerificationMethod, 
  ServiceEndpoint 
} from '../types';

export class DIDManager {
  private provider: ethers.Provider;
  private registryContract: ethers.Contract;

  constructor(provider: ethers.Provider) {
    this.provider = provider;
    this.registryContract = new ethers.Contract(
      DID_CONFIG.registryAddress,
      DID_REGISTRY_ABI,
      provider
    );
  }

  async createDID(signer: ethers.Signer): Promise<DIDUser> {
    const address = await signer.getAddress();
    const did = `did:${DID_CONFIG.method}:${DID_CONFIG.network}:${address}`;
    
    const didDocument = this.createDIDDocument(did, address);
    
    // Register on blockchain
    const contractWithSigner = this.registryContract.connect(signer);
    const tx = await (contractWithSigner as any).updateDIDDocument(
      did,
      JSON.stringify(didDocument)
    );
    await tx.wait();

    return {
      did,
      address,
      document: didDocument,
      createdAt: new Date(),
      isVerified: true
    };
  }

  private createDIDDocument(did: string, address: string): DIDDocument {
    const verificationMethodId = `${did}#key-1`;
    const serviceId = `${did}#trustblock`;

    const verificationMethod: VerificationMethod = {
      id: verificationMethodId,
      type: VERIFICATION_TYPES.ECDSA_SECP256K1,
      controller: did,
      ethereumAddress: address
    };

    const service: ServiceEndpoint = {
      id: serviceId,
      type: 'TrustBlockProfile',
      serviceEndpoint: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile/${address}`,
      description: 'TrustBlock reputation and campaign profile'
    };

    return {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/secp256k1-2019/v1'
      ],
      id: did,
      verificationMethod: [verificationMethod],
      authentication: [verificationMethodId],
      assertionMethod: [verificationMethodId],
      service: [service],
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
  }

  async resolveDID(did: string): Promise<DIDResolutionResult> {
    try {
      // First check if DID exists
      const exists = await (this.registryContract as any).didExists(did);
      if (!exists) {
        return {
          didDocument: null,
          didResolutionMetadata: {
            error: 'notFound'
          },
          didDocumentMetadata: {}
        };
      }

      const documentJson = await (this.registryContract as any).getDIDDocument(did);
      
      if (!documentJson) {
        return {
          didDocument: null,
          didResolutionMetadata: {
            error: 'notFound'
          },
          didDocumentMetadata: {}
        };
      }

      const didDocument: DIDDocument = JSON.parse(documentJson);
      const version = await (this.registryContract as any).getDIDVersion(did);

      return {
        didDocument,
        didResolutionMetadata: {
          contentType: 'application/did+ld+json'
        },
        didDocumentMetadata: {
          created: didDocument.created,
          updated: didDocument.updated,
          versionId: version.toString()
        }
      };
    } catch (error) {
      console.error('Error resolving DID:', error);
      return {
        didDocument: null,
        didResolutionMetadata: {
          error: 'internalError'
        },
        didDocumentMetadata: {}
      };
    }
  }

  async updateDIDDocument(
    did: string, 
    updatedDocument: Partial<DIDDocument>, 
    signer: ethers.Signer
  ): Promise<boolean> {
    try {
      const currentResult = await this.resolveDID(did);
      if (!currentResult.didDocument) {
        throw new Error('DID not found');
      }

      const mergedDocument: DIDDocument = {
        ...currentResult.didDocument,
        ...updatedDocument,
        updated: new Date().toISOString()
      };

      const contractWithSigner = this.registryContract.connect(signer);
      const tx = await (contractWithSigner as any).updateDIDDocument(
        did,
        JSON.stringify(mergedDocument)
      );
      await tx.wait();

      return true;
    } catch (error) {
      console.error('Error updating DID document:', error);
      return false;
    }
  }

  async isDIDOwner(did: string, address: string): Promise<boolean> {
    try {
      const owner = await (this.registryContract as any).getDIDOwner(did);
      return owner.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Error checking DID ownership:', error);
      return false;
    }
  }

  extractAddressFromDID(did: string): string | null {
    const parts = did.split(':');
    if (parts.length >= 3 && parts[0] === 'did' && parts[1] === DID_CONFIG.method) {
      return parts[parts.length - 1];
    }
    return null;
  }

  validateDIDFormat(did: string): boolean {
    const didRegex = /^did:[a-z0-9]+:[a-zA-Z0-9._-]+$/;
    return didRegex.test(did);
  }
}