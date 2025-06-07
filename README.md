# 🌟 TrustBlock - Financiamiento confiable para causas que importan

**TrustBlock** es una plataforma Web3 de donaciones que combina la transparencia de la blockchain con una interfaz moderna y fácil de usar. Permite crear campañas de donación verificables, realizar donaciones en tiempo real y hacer seguimiento completo de los fondos mediante smart contracts.

## 🚀 Características Principales

- **🔗 Blockchain Nativa**: Smart contracts desplegados en Moonbase Alpha (Testnet de Polkadot)
- **💰 Donaciones en DOT**: Soporte completo para donaciones decimales en tokens DOT
- **🔍 Transparencia Total**: Todas las transacciones son públicas y verificables en blockchain
- **⚡ Tiempo Real**: Actualizaciones instantáneas de campañas mediante eventos de blockchain
- **🎨 UI Moderna**: Interfaz responsive con TailwindCSS y componentes shadcn/ui
- **🦊 MetaMask**: Integración completa con MetaMask para gestión de wallet
- **📊 Analytics**: Seguimiento detallado de donaciones, gastos y transparencia
- **🖼️ Gestión de Imágenes**: Soporte para imágenes de campañas almacenadas en blockchain

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos utility-first
- **shadcn/ui** - Componentes UI modernos
- **Ethers.js v6** - Interacción con blockchain
- **Recharts** - Visualización de datos

### Blockchain
- **Solidity ^0.8.19** - Smart contracts
- **Hardhat** - Framework de desarrollo
- **Moonbase Alpha** - Red de testnet (Polkadot)
- **MetaMask** - Proveedor de wallet

### Smart Contracts
- **CampaignFactory**: Factory para crear nuevas campañas
- **Campaign**: Contrato individual de cada campaña

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** o **yarn**
- **MetaMask** instalado en el navegador
- **Tokens DEV** de testnet para gas (obtenibles del faucet)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/TrustblockNerdConf.git
cd TrustblockNerdConf
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar MetaMask

#### A. Agregar Red Moonbase Alpha

1. Abrir MetaMask
2. Hacer clic en el menú de redes (arriba)
3. Seleccionar "Agregar red manualmente"
4. Completar con estos datos:

```
Nombre de red: Moonbase Alpha
URL RPC: https://rpc.api.moonbase.moonbeam.network
ID de cadena: 1287
Símbolo de moneda: DEV
URL del explorador de bloques: https://moonbase.moonscan.io/
```

#### B. Obtener Tokens DEV de Testnet

1. Visitar: [Moonbase Alpha Faucet](https://apps.moonbeam.network/moonbase-alpha/faucet/)
2. Conectar MetaMask
3. Solicitar tokens DEV (necesarios para gas)

### 4. Configurar Variables de Entorno (Opcional)

```bash
# .env.local
NEXT_PUBLIC_NETWORK=moonbase-alpha
NEXT_PUBLIC_FACTORY_ADDRESS=0x9778D20AB3D7Bb5995292e1aa44223FC2489ebf6
```

### 5. Ejecutar el Proyecto

```bash
npm run dev
```

La aplicación estará disponible en `https://trustblockdot.vercel.app/`

## 📝 Contratos Desplegados

### Red: Moonbase Alpha (Chain ID: 1287)

- **CampaignFactory**: `0x9778D20AB3D7Bb5995292e1aa44223FC2489ebf6`
- **Explorer**: [Ver en Moonscan](https://moonbase.moonscan.io/address/0x9778D20AB3D7Bb5995292e1aa44223FC2489ebf6)

## 🎯 Cómo Usar la Plataforma

### 1. Conectar Wallet

1. Hacer clic en "Conectar Wallet" en la navegación
2. Autorizar conexión en MetaMask
3. Asegurarse de estar en la red Moonbase Alpha

### 2. Crear una Campaña

1. Ir a "Crear Campaña" en el menú
2. Completar el formulario:
   - **Título**: Nombre de la campaña
   - **Descripción**: Explicación detallada
   - **Organización**: Nombre de la entidad
   - **Meta**: Cantidad objetivo en DOT
   - **Duración**: Días que durará la campaña
   - **Imagen**: URL de imagen (debe ser enlace directo .jpg, .png, etc.)
3. Confirmar transacción en MetaMask
4. Esperar confirmación en blockchain

### 3. Realizar Donaciones

1. Navegar a cualquier campaña
2. Hacer clic en "Donar Ahora"
3. Ingresar cantidad (acepta decimales, ej: 0.01 DOT)
4. Confirmar transacción en MetaMask
5. Ver actualización en tiempo real

### 4. Seguimiento de Transparencia

- **Lista de Transacciones**: Ver todas las donaciones y gastos
- **Desglose de Gastos**: Categorización de uso de fondos
- **Análisis**: Gráficos y métricas de la campaña

## 🏗️ Arquitectura del Proyecto

```
TrustblockNerdConf/
├── app/                    # App Router de Next.js
│   ├── campaigns/         # Páginas de campañas
│   ├── create/           # Página de creación
│   └── page.tsx          # Página principal
├── components/           # Componentes React
│   ├── ui/              # Componentes shadcn/ui
│   ├── providers/       # Proveedores de contexto
│   └── forms/           # Formularios
├── contracts/           # Smart contracts Solidity
│   ├── Campaign.sol     # Contrato de campaña individual
│   └── CampaignFactory.sol # Factory de campañas
├── hooks/              # Custom hooks
│   ├── useBlockchainContracts.ts # Hook principal de blockchain
│   └── useContracts.ts  # Hook de contratos (legacy)
├── types/              # Definiciones TypeScript
└── lib/                # Utilidades
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Construcción
npm run build        # Construir para producción
npm start           # Iniciar servidor de producción

# Linting
npm run lint        # Ejecutar ESLint
```

## 🧪 Testing y Desarrollo

### Funcionalidades Implementadas

- ✅ Conexión con MetaMask
- ✅ Creación de campañas en blockchain
- ✅ Donaciones con soporte decimal
- ✅ Actualizaciones en tiempo real
- ✅ Seguimiento de transparencia
- ✅ Gestión de imágenes
- ✅ Validación de red (Moonbase Alpha)
- ✅ Manejo de errores

### Para Testing

1. Asegúrate de tener tokens DEV en tu wallet
2. Usa cantidades pequeñas para testing (0.01-1 DOT)
3. Verifica transacciones en [Moonscan](https://moonbase.moonscan.io)

## 🔐 Seguridad

- Smart contracts auditados para funcionalidad básica
- Validación de red en frontend
- Manejo seguro de claves privadas (nunca expuestas)
- Verificación de transacciones en blockchain

## 🚨 Troubleshooting

### Error: "Wrong Network"
- **Solución**: Cambiar a Moonbase Alpha en MetaMask

### Error: "Insufficient Funds"
- **Solución**: Obtener más tokens DEV del faucet

### Error: "Transaction Failed"
- **Solución**: Verificar que tienes suficiente DEV para gas

### Imágenes no se cargan
- **Solución**: Usar enlaces directos a imágenes (.jpg, .png, .gif)

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🔗 Enlaces Útiles

- **Moonbase Alpha Faucet**: https://apps.moonbeam.network/moonbase-alpha/faucet/
- **Moonscan Explorer**: https://moonbase.moonscan.io/
- **MetaMask**: https://metamask.io/
- **Polkadot**: https://polkadot.network/

## 📞 Soporte

Para soporte y preguntas, por favor abrir un issue en GitHub o contactar al equipo de desarrollo.

---

**¡Construyendo el futuro de las donaciones descentralizadas! 🚀**