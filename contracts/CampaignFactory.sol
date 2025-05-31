// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Campaign.sol";

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    event CampaignCreated(address campaignAddress, address creator, string title);
    
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _durationInDays
    ) public {
        Campaign newCampaign = new Campaign(
            _title,
            _description,
            _targetAmount,
            _durationInDays
        );
        
        deployedCampaigns.push(address(newCampaign));
        
        emit CampaignCreated(address(newCampaign), msg.sender, _title);
    }
    
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
    
    function getCampaignsCount() public view returns (uint256) {
        return deployedCampaigns.length;
    }
}