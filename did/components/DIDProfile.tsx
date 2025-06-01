import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useDID } from '../hooks/useDID';
import { DIDUser, DIDDocument } from '../types';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Alert } from '../../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface DIDProfileProps {
  address: string;
  provider?: ethers.Provider;
  signer?: ethers.Signer;
}

export const DIDProfile: React.FC<DIDProfileProps> = ({ address, provider, signer }) => {
  const { 
    didUser, 
    loading, 
    error, 
    createDID, 
    resolveDID, 
    verifyOwnership,
    clearError 
  } = useDID({ provider, signer });

  const [resolvedDID, setResolvedDID] = useState<DIDDocument | null>(null);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);

  useEffect(() => {
    if (address && provider) {
      loadDIDData();
    }
  }, [address, provider]);

  const loadDIDData = async () => {
    const did = `did:ethr:sepolia:${address}`;
    
    // Try to resolve existing DID
    const result = await resolveDID(did);
    if (result?.didDocument) {
      setResolvedDID(result.didDocument);
      
      // Check ownership if signer is available
      if (signer) {
        const ownership = await verifyOwnership(did, address);
        setIsOwner(ownership);
      }
    }
  };

  const handleCreateDID = async () => {
    if (!signer) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const newDID = await createDID();
      if (newDID) {
        setResolvedDID(newDID.document);
        setIsOwner(true);
      }
    } catch (err) {
      console.error('Failed to create DID:', err);
    }
  };

  const formatDID = (did: string) => {
    if (did.length > 30) {
      return `${did.substring(0, 15)}...${did.substring(did.length - 15)}`;
    }
    return did;
  };

  const getStatusBadge = () => {
    if (!resolvedDID) return <Badge variant="secondary">No DID</Badge>;
    if (isOwner === true) return <Badge variant="default">Verified Owner</Badge>;
    if (isOwner === false) return <Badge variant="destructive">Not Owner</Badge>;
    return <Badge variant="outline">Unknown</Badge>;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold">Decentralized Identity (DID)</h3>
            <p className="text-muted-foreground">
              Manage your Web3 identity for TrustBlock
            </p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={clearError} className="mt-2">
              Dismiss
            </Button>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading DID...</span>
          </div>
        )}

        {/* DID Content */}
        {!loading && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="document">DID Document</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {resolvedDID ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">DID Identifier</label>
                    <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                      {resolvedDID.id}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Address</label>
                      <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm">
                        {address}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Network</label>
                      <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                        Sepolia Testnet
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Verification Methods</label>
                      <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                        {resolvedDID.verificationMethod.length} method(s)
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Services</label>
                      <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                        {resolvedDID.service?.length || 0} service(s)
                      </div>
                    </div>
                  </div>

                  {resolvedDID.created && (
                    <div>
                      <label className="text-sm font-medium">Created</label>
                      <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                        {new Date(resolvedDID.created).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="space-y-4">
                    <div className="text-6xl">🆔</div>
                    <h4 className="text-xl font-semibold">No DID Found</h4>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      This address doesn't have a Decentralized Identity yet. 
                      Create one to establish your Web3 reputation.
                    </p>
                    <Button onClick={handleCreateDID} disabled={!signer || loading}>
                      Create DID
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="document" className="space-y-4">
              {resolvedDID ? (
                <div>
                  <label className="text-sm font-medium">Complete DID Document</label>
                  <div className="mt-1 p-4 bg-muted rounded-md">
                    <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                      {JSON.stringify(resolvedDID, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No DID document available
                </div>
              )}
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              {resolvedDID?.service && resolvedDID.service.length > 0 ? (
                <div className="space-y-4">
                  {resolvedDID.service.map((service, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{service.type}</h4>
                          <Badge variant="outline">{service.id.split('#')[1]}</Badge>
                        </div>
                        
                        <div>
                          <label className="text-xs text-muted-foreground">Service Endpoint</label>
                          <div className="text-sm font-mono break-all">
                            {Array.isArray(service.serviceEndpoint) 
                              ? service.serviceEndpoint.join(', ')
                              : service.serviceEndpoint
                            }
                          </div>
                        </div>

                        {service.description && (
                          <div>
                            <label className="text-xs text-muted-foreground">Description</label>
                            <div className="text-sm">{service.description}</div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No services configured
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Card>
  );
};