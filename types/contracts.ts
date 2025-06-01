export interface CampaignData {
  creator: string;
  title: string;
  description: string;
  targetAmount: string;
  currentAmount: string;
  deadline: number;
  isActive: boolean;
  goalReached: boolean;
}

export interface CreateCampaignParams {
  title: string;
  description: string;
  targetAmount: string;
  durationInDays: number;
}

export interface ContractInteraction {
  txHash: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
}

export interface Campaign {
  address: string;
  data: CampaignData;
  createdAt: number;
}