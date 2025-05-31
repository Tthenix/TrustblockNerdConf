// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Campaign {
    struct CampaignData {
        address creator;
        string title;
        string description;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 deadline;
        bool isActive;
        bool goalReached;
    }
    
    CampaignData public campaign;
    mapping(address => uint256) public contributions;
    address[] public contributors;
    
    event ContributionMade(address contributor, uint256 amount);
    event GoalReached(uint256 totalAmount);
    event FundsWithdrawn(address creator, uint256 amount);
    
    modifier onlyCreator() {
        require(msg.sender == campaign.creator, "Only creator can call this");
        _;
    }
    
    modifier isActiveCampaign() {
        require(campaign.isActive && block.timestamp <= campaign.deadline, "Campaign not active");
        _;
    }
    
    constructor(
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _durationInDays
    ) {
        campaign = CampaignData({
            creator: msg.sender,
            title: _title,
            description: _description,
            targetAmount: _targetAmount,
            currentAmount: 0,
            deadline: block.timestamp + (_durationInDays * 1 days),
            isActive: true,
            goalReached: false
        });
    }
    
    function contribute() external payable isActiveCampaign {
        require(msg.value > 0, "Contribution must be greater than 0");
        
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        
        contributions[msg.sender] += msg.value;
        campaign.currentAmount += msg.value;
        
        emit ContributionMade(msg.sender, msg.value);
        
        if (campaign.currentAmount >= campaign.targetAmount && !campaign.goalReached) {
            campaign.goalReached = true;
            emit GoalReached(campaign.currentAmount);
        }
    }
    
    function withdrawFunds() external onlyCreator {
        require(campaign.goalReached || block.timestamp > campaign.deadline, "Cannot withdraw yet");
        require(campaign.currentAmount > 0, "No funds to withdraw");
        
        uint256 amount = campaign.currentAmount;
        campaign.currentAmount = 0;
        campaign.isActive = false;
        
        payable(campaign.creator).transfer(amount);
        emit FundsWithdrawn(campaign.creator, amount);
    }
    
    function refund() external {
        require(block.timestamp > campaign.deadline && !campaign.goalReached, "Refund not available");
        require(contributions[msg.sender] > 0, "No contribution to refund");
        
        uint256 amount = contributions[msg.sender];
        contributions[msg.sender] = 0;
        
        payable(msg.sender).transfer(amount);
    }
    
    function getCampaignInfo() external view returns (CampaignData memory) {
        return campaign;
    }
    
    function getContributors() external view returns (address[] memory) {
        return contributors;
    }
}