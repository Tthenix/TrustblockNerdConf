# TrustBlock DID (Decentralized Identity) System

## 📝 Descripción

El sistema DID de TrustBlock permite a los usuarios crear y gestionar identidades descentralizadas que se integran con su reputación en la plataforma. Los DIDs proporcionan una forma estándar y verificable de establecer identidades digitales sin depender de autoridades centralizadas.

## 🏗️ Arquitectura

```
did/
├── components/          # Componentes React para UI
│   ├── DIDProfile.tsx   # Componente principal del perfil DID
│   └── index.ts         # Exportaciones
├── config/              # Configuración del sistema
│   └── did.config.ts    # Configuración de red y contratos
├── contracts/           # Contratos inteligentes
│   └── DIDRegistry.sol  # Registro principal de DIDs
├── hooks/               # React hooks
│   └── useDID.ts        # Hook principal para DID
├── services/            # Servicios de negocio
│   ├── didManager.ts    # Gestión de DIDs
│   └── didAuth.ts       # Autenticación con DID
├── types/               # Interfaces TypeScript
│   └── index.ts         # Tipos y interfaces
└── utils/               # Utilidades
    └── helpers.ts       # Funciones auxiliares
```

## 🚀 Instalación y Configuración

### 1. Dependencias

Las siguientes dependencias ya están instaladas:

```bash
npm install did-resolver ethr-did-resolver ethr-did-registry
npm install @veramo/core @veramo/did-manager @veramo/key-manager
```

### 2. Variables de Entorno

Agrega estas variables a tu `.env.local`:

```bash
# DID Configuration
NEXT_PUBLIC_DID_REGISTRY=0x... # Dirección del contrato DIDRegistry
NEXT_PUBLIC_DID_RESOLVER=https://uniresolver.io
NEXT_PUBLIC_NETWORK=sepolia
```

### 3. Deploy del Contrato

Compila y despliega el contrato `DIDRegistry.sol` en la red Sepolia:

```bash
# Usando Hardhat, Foundry, o tu herramienta preferida
npx hardhat compile
npx hardhat deploy --network sepolia
```

## 📖 Uso

### Importación Básica

```typescript
import { DIDProfile, useDID, DIDManager } from '@/did/components';
```

### Componente React

```tsx
import { DIDProfile } from '@/did/components';

function UserProfile({ address, provider, signer }) {
  return (
    <div>
      <DIDProfile 
        address={address}
        provider={provider}
        signer={signer}
      />
    </div>
  );
}
```

### Hook useDID

```typescript
import { useDID } from '@/did/hooks/useDID';

function MyComponent() {
  const { 
    didUser, 
    loading, 
    error, 
    createDID, 
    resolveDID 
  } = useDID({ provider, signer });

  const handleCreateDID = async () => {
    const newDID = await createDID();
    console.log('DID creado:', newDID);
  };

  return (
    <div>
      {didUser ? (
        <p>DID: {didUser.did}</p>
      ) : (
        <button onClick={handleCreateDID}>Crear DID</button>
      )}
    </div>
  );
}
```

### Servicios Directos

```typescript
import { DIDManager, DIDAuthService } from '@/did/services';

// Crear instancias
const didManager = new DIDManager(provider);
const authService = new DIDAuthService(didManager);

// Crear DID
const didUser = await didManager.createDID(signer);

// Autenticación
const challenge = authService.generateAuthChallenge(address);
const signature = await signer.signMessage(challenge.challenge);
const isValid = await authService.authenticateWithDID(did, signature, address);
```

## 🔧 API Reference

### DIDManager

```typescript
class DIDManager {
  // Crear un nuevo DID
  createDID(signer: ethers.Signer): Promise<DIDUser>
  
  // Resolver un DID existente
  resolveDID(did: string): Promise<DIDResolutionResult>
  
  // Actualizar documento DID
  updateDIDDocument(did: string, updates: Partial<DIDDocument>, signer: ethers.Signer): Promise<boolean>
  
  // Verificar propiedad
  isDIDOwner(did: string, address: string): Promise<boolean>
  
  // Utilidades
  extractAddressFromDID(did: string): string | null
  validateDIDFormat(did: string): boolean
}
```

### DIDAuthService

```typescript
class DIDAuthService {
  // Generar desafío de autenticación
  generateAuthChallenge(address: string): DIDAuthChallenge
  
  // Autenticar con DID
  authenticateWithDID(did: string, signature: string, address: string): Promise<boolean>
  
  // Verificar propiedad de DID
  verifyDIDOwnership(did: string, address: string): Promise<boolean>
}
```

### Hook useDID

```typescript
interface UseDIDReturn {
  // Estado
  didUser: DIDUser | null;
  loading: boolean;
  error: string | null;
  authChallenge: DIDAuthChallenge | null;
  
  // Acciones
  createDID(): Promise<DIDUser | null>;
  resolveDID(did: string): Promise<DIDResolutionResult | null>;
  updateDIDDocument(did: string, updates: Partial<DIDDocument>): Promise<boolean>;
  generateChallenge(address: string): DIDAuthChallenge | null;
  authenticateWithSignature(did: string, signature: string, address: string): Promise<boolean>;
  verifyOwnership(did: string, address: string): Promise<boolean>;
  clearError(): void;
}
```

## 📋 Tipos Principales

### DIDDocument

```typescript
interface DIDDocument {
  '@context': string[];
  id: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod?: string[];
  service?: ServiceEndpoint[];
  created?: string;
  updated?: string;
}
```

### DIDUser

```typescript
interface DIDUser {
  did: string;
  address: string;
  document: DIDDocument;
  createdAt: Date;
  updatedAt?: Date;
  isVerified: boolean;
  reputation?: ReputationLink;
}
```

## 🔐 Seguridad

### Mejores Prácticas

1. **Validación de Firmas**: Siempre verificar firmas antes de operaciones críticas
2. **Expiración de Desafíos**: Los desafíos expiran en 15 minutos
3. **Verificación de Propiedad**: Verificar que el usuario es propietario del DID
4. **Sanitización de Datos**: Validar y sanitizar documentos DID

### Consideraciones

- Los DIDs son inmutables una vez creados
- Solo el propietario puede actualizar el documento DID
- Las claves privadas nunca se almacenan en blockchain
- Los documentos DID son públicos por diseño

## 🌐 Integración con TrustBlock

### Vinculación con Reputación

```typescript
// El DID incluye automáticamente un servicio TrustBlock
const service = {
  id: `${did}#trustblock`,
  type: 'TrustBlockProfile',
  serviceEndpoint: `${APP_URL}/profile/${address}`,
  description: 'TrustBlock reputation and campaign profile'
};
```

### Uso en Campañas

Los DIDs permiten:
- Verificación de identidad de creadores de campañas
- Vinculación de reputación entre campañas
- Autenticación descentralizada
- Portabilidad de identidad

## 🧪 Testing

### Ejemplo de Test

```typescript
import { DIDManager } from '@/did/services/didManager';

describe('DIDManager', () => {
  test('should create DID', async () => {
    const manager = new DIDManager(provider);
    const didUser = await manager.createDID(signer);
    
    expect(didUser.did).toMatch(/^did:ethr:sepolia:/);
    expect(didUser.isVerified).toBe(true);
  });
});
```

## 📝 TODO / Mejoras Futuras

- [ ] Implementar revocación de DIDs
- [ ] Soporte para múltiples redes
- [ ] Integración con otros métodos DID (did:web, did:key)
- [ ] Credenciales verificables
- [ ] Interfaz de gestión avanzada
- [ ] Backup y recuperación de DIDs
- [ ] Métricas y analytics

## 🐛 Troubleshooting

### Errores Comunes

1. **"DID not found"**: El DID no existe en el registro
2. **"Not the DID owner"**: El usuario no es propietario del DID
3. **"Invalid signature"**: La firma no corresponde al desafío
4. **"Challenge expired"**: El desafío de autenticación expiró

### Logs

Habilita logs para debugging:

```typescript
// En desarrollo
console.log('DID operation:', { did, address, operation });
```

## 📚 Referencias

- [W3C DID Specification](https://www.w3.org/TR/did-core/)
- [DID Method Registry](https://w3c.github.io/did-spec-registries/)
- [Ethereum DID Method](https://github.com/decentralized-identity/ethr-did)
- [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)