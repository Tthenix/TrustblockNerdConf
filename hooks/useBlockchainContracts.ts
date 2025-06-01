import { useWeb3 } from "@/components/providers/web3-provider";
import { ethers } from "ethers";
import { useState, useCallback } from "react";

// ✅ Dirección del contrato CampaignFactory desplegado en Moonbase Alpha
// NOTA: Esta dirección debe ser actualizada después de desplegar el contrato
const CAMPAIGN_FACTORY_ADDRESS = "0x9778D20AB3D7Bb5995292e1aa44223FC2489ebf6";

// ABIs de tus contratos
const CAMPAIGN_FACTORY_ABI = [
  "function createCampaign(string memory _title, string memory _description, string memory _image, string memory _organization, uint256 _targetAmount, uint256 _durationInDays) external",
  "function deployedCampaigns(uint256) external view returns (address)",
  "function getCampaignsCount() external view returns (uint256)",
  "function getDeployedCampaigns() external view returns (address[])",
  "event CampaignCreated(address campaignAddress, address creator, string title)"
];

const CAMPAIGN_ABI = 
		[
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "_description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "_image",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "_organization",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "_targetAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_durationInDays",
						"type": "uint256"
					}
				],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "contributor",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"name": "ContributionMade",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"name": "FundsWithdrawn",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "totalAmount",
						"type": "uint256"
					}
				],
				"name": "GoalReached",
				"type": "event"
			},
			{
				"inputs": [],
				"name": "campaign",
				"outputs": [
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "image",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "organization",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "targetAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "currentAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deadline",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "goalReached",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "contribute",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "contributions",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "contributors",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getCampaignInfo",
				"outputs": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "creator",
								"type": "address"
							},
							{
								"internalType": "string",
								"name": "title",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "description",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "image",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "organization",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "targetAmount",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "currentAmount",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "deadline",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "isActive",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "goalReached",
								"type": "bool"
							}
						],
						"internalType": "struct Campaign.CampaignData",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getContributors",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "",
						"type": "address[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "refund",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "withdrawFunds",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		];

export interface BlockchainCampaign {
  address: string;
  title: string;
  description: string;
  targetAmount: string;
  amountRaised: string;
  deadline: number;
  creator: string;
  contributersCount: number;
  id: string;
  organization: string;
  raised: string;
  goal: string;
  backers: number;
  daysLeft: number;
  image: string;
  // ✅ Propiedades opcionales para compatibilidad total
  featured?: boolean;
  verified?: boolean;
  category?: string;
  location?: string;
  website?: string;
}

export function useBlockchainContracts() {
  const { signer, provider, isConnected, account, chainId } = useWeb3();
  const [loading, setLoading] = useState(false);

  const createCampaignOnBlockchain = async (campaignData: {
    title: string;
    description: string;
    image: string;
    organization: string;
    goal: string;
    durationDays: number;
  }) => {
    try {
      setLoading(true);
      
      if (!isConnected || !signer) {
        throw new Error("Please connect your wallet first");
      }

      // Verificar que estamos en la red correcta
      if (chainId !== 1287) {
        throw new Error("Please switch to Moonbase Alpha network (Chain ID: 1287)");
      }

      console.log("🏗️ Creating contract instance...");
      const factory = new ethers.Contract(CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI, signer);
      
      const targetAmountWei = ethers.parseEther(campaignData.goal);
      
      console.log("📝 Campaign data to send:", {
        title: campaignData.title,
        description: campaignData.description,
        image: campaignData.image,
        organization: campaignData.organization,
        targetAmount: targetAmountWei,
        durationInDays: campaignData.durationDays
      });

      // Verificar el balance del usuario para gas
      const balance = await signer.provider.getBalance(await signer.getAddress());
      console.log("💰 User balance:", ethers.formatEther(balance), "DEV");

      // Estimar gas antes de enviar la transacción
      console.log("⛽ Estimating gas...");
      try {
        const gasEstimate = await factory.createCampaign.estimateGas(
          campaignData.title,
          campaignData.description,
          campaignData.image,
          campaignData.organization,
          targetAmountWei,
          campaignData.durationDays
        );
        console.log("⛽ Gas estimate:", gasEstimate.toString());
      } catch (gasError) {
        console.error("❌ Gas estimation failed:", gasError);
        throw new Error("Failed to estimate gas. The contract might not be deployed correctly.");
      }

      console.log("📤 Sending transaction...");
      const tx = await factory.createCampaign(
        campaignData.title,
        campaignData.description,
        campaignData.image,
        campaignData.organization,
        targetAmountWei,
        campaignData.durationDays
      );

      console.log("✅ Transaction sent:", tx.hash);
      console.log("⏳ Waiting for confirmation...");
      const receipt = await tx.wait();
      console.log("🎉 Transaction confirmed:", receipt);

      return receipt;
    } catch (error: any) {
      console.error("❌ Error creating campaign on blockchain:", error);
      
      // Mejorar los mensajes de error
      if (error.message?.includes("user rejected")) {
        throw new Error("Transaction was rejected by user");
      } else if (error.message?.includes("insufficient funds")) {
        throw new Error("Insufficient funds for gas fees");
      } else if (error.message?.includes("network")) {
        throw new Error("Network error. Please check your connection to Moonbase Alpha");
      } else if (error.message?.includes("contract")) {
        throw new Error("Contract error. The factory contract might not be deployed correctly");
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllCampaigns = useCallback(async (): Promise<BlockchainCampaign[]> => {
    try {
      // Si no hay dirección del contrato configurada, devolver array vacío
      if (!CAMPAIGN_FACTORY_ADDRESS) {
        console.log("Contract address not configured yet");
        return [];
      }
      
      if (!provider) {
        console.log("Provider not available");
        return [];
      }

      console.log("🔗 Attempting to connect to contract:", CAMPAIGN_FACTORY_ADDRESS);
      console.log("🌐 Provider network info:", await provider.getNetwork());

      const factory = new ethers.Contract(CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI, provider);
      
      // Verificar si el contrato existe
      try {
        console.log("📋 Calling getDeployedCampaigns...");
        const campaignAddresses = await factory.getDeployedCampaigns();
        console.log("📦 Raw campaign addresses:", campaignAddresses);
        
        if (campaignAddresses.length === 0) {
          console.log("ℹ️ No campaigns found in contract");
          return [];
        }
        
        const campaigns: BlockchainCampaign[] = [];

        for (let i = 0; i < campaignAddresses.length; i++) {
          const campaignAddress = campaignAddresses[i];
          // Reduced logging to prevent spam
          
          const campaign = new ethers.Contract(campaignAddress, CAMPAIGN_ABI, provider);

          try {
            let campaignData = await campaign.getCampaignInfo();
            // Only log basic info, not full campaign data to reduce spam

            // Extraer datos del struct retornado
            const {
              creator,
              title,
              description,
              image,
              organization,
              targetAmount,
              currentAmount: amountRaised,
              deadline,
              isActive,
              goalReached
            } = campaignData;

            const targetAmountEther = ethers.formatEther(targetAmount);
            const raisedAmountEther = ethers.formatEther(amountRaised);
            const deadlineDate = new Date(Number(deadline) * 1000);
            const now = new Date();
            const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

            // Obtener número de contribuyentes
            const contributors = await campaign.getContributors();
            const contributersCount = contributors.length;

            // 🎨 Array de imágenes para campañas blockchain
            const blockchainImages = [
              "/img/campana/blockchain-campaign.jpg",
              "/img/campana/52242f9a-f563-4e47-b21a-83ef501c00e6.jpeg",
              "/img/campana/Reforestación Amazónica.jpeg",
              "/img/campana/Energía Solar para Comunidades.jpg",
              "/img/campana/Educación Digital Inclusiva.jpg"
            ];

            // 🖼️ Para campañas de prueba/test usar imagen genérica, 
            // para campañas reales usar la imagen rotativa
            const campaignImage = title.includes("test") || title.includes("Test")
              ? "/img/campana/blockchain-campaign.jpg" // Imagen genérica para tests
              : blockchainImages[i % blockchainImages.length]; // Imágenes variadas para campañas reales

            campaigns.push({
              // Propiedades del blockchain para compatibilidad
              address: campaignAddress,
              targetAmount: targetAmountEther,
              amountRaised: raisedAmountEther,
              deadline: Number(deadline),
              creator,
              contributersCount,
              
              // ✅ Formato EXACTO como las campañas de ejemplo
              id: campaignAddress,
              title,
              organization: organization || "TrustBlock Foundation",
              description,
              raised: raisedAmountEther,
              goal: targetAmountEther,
              backers: contributersCount,
              daysLeft,
              image: image || "/img/campana/blockchain-campaign.jpg",
              
              // ✅ Propiedades opcionales como en las campañas de ejemplo
              featured: i === 0, // La primera campaña blockchain será featured
              verified: true,    // Las campañas blockchain están verificadas
              category: "Blockchain",
              location: "Descentralizada",
              website: `https://moonbase.moonscan.io/address/${campaignAddress}`
            });
          } catch (error) {
            console.error(`❌ Error loading campaign ${campaignAddress}:`, error);
          }
        }

        console.log("✅ Successfully loaded campaigns:", campaigns);
        return campaigns;
      } catch (contractError: any) {
        console.error("❌ Contract call failed:", contractError);
        console.log("🔍 Error details:", {
          message: contractError.message,
          code: contractError.code,
          data: contractError.data
        });
        return [];
      }
    } catch (error) {
      console.error("❌ Error loading campaigns from blockchain:", error);
      return [];
    }
  }, [provider]);

  const donateToBlockchainCampaign = async (campaignAddress: string, amountEth: string) => {
    try {
      setLoading(true);
      
      if (!signer) throw new Error("Wallet not connected");

      const campaign = new ethers.Contract(campaignAddress, CAMPAIGN_ABI, signer);
      
      // Convertir el monto a wei
      const amountInWei = ethers.parseEther(amountEth);
      
      // Enviar la transacción con el valor en wei
      const tx = await campaign.contribute({ 
        value: amountInWei,
        gasLimit: 300000 // Añadir un límite de gas explícito
      });

      console.log("Donation transaction sent:", tx.hash);
      return tx;
    } catch (error) {
      console.error("Error donating to blockchain campaign:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCampaignDetails = useCallback(async (campaignAddress: string): Promise<BlockchainCampaign | null> => {
    try {
      // Verificar si el provider está disponible, si no, crear uno temporal
      let currentProvider = provider;
      if (!currentProvider && typeof window !== 'undefined' && window.ethereum) {
        console.log("Provider not available, creating temporary provider...");
        currentProvider = new ethers.BrowserProvider(window.ethereum);
      }
      
      if (!currentProvider) {
        console.error("No provider available");
        return null;
      }

      const campaign = new ethers.Contract(campaignAddress, CAMPAIGN_ABI, currentProvider);
      
      const campaignData = await campaign.getCampaignInfo();
      // Reduced console logging to prevent spam
      
      // Extraer datos del struct retornado
      const {
        creator,
        title,
        description,
        image,
        organization,
        targetAmount,
        currentAmount: amountRaised,
        deadline,
        isActive,
        goalReached
      } = campaignData;

      const targetAmountEther = ethers.formatEther(targetAmount);
      const raisedAmountEther = ethers.formatEther(amountRaised);
      const deadlineDate = new Date(Number(deadline) * 1000);
      const now = new Date();
      const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

      // Obtener número de contribuyentes
      const contributors = await campaign.getContributors();
      const contributersCount = contributors.length;

      return {
        address: campaignAddress,
        title,
        description,
        targetAmount: targetAmountEther,
        amountRaised: raisedAmountEther,
        deadline: Number(deadline),
        creator,
        contributersCount,
        id: campaignAddress,
        organization: organization || "TrustBlock Foundation",
        raised: raisedAmountEther,
        goal: targetAmountEther,
        backers: contributersCount,
        daysLeft,
        image: image || "/img/campana/blockchain-campaign.jpg",
        featured: false,
        verified: true,
        category: "Blockchain",
        location: "Descentralizada",
        website: `https://moonbase.moonscan.io/address/${campaignAddress}`
      };
    } catch (error) {
      console.error("Error getting campaign details:", error);
      return null;
    }
  }, [provider]);
      
  return {
    createCampaignOnBlockchain,
    getAllCampaigns,
    donateToBlockchainCampaign,
    getCampaignDetails,
    loading,
    isConnected,
    userAccount: account,
    CAMPAIGN_FACTORY_ADDRESS,
    provider
  };
}