// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Campaign.sol";

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    event CampaignCreated(address campaignAddress, address creator, string title);
    
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _image,
        string memory _organization,
        uint256 _targetAmount,
        uint256 _durationInDays
    ) public {
        // TODO: Implementar verificación con SumSub en el futuro
        // Por ahora permitimos que cualquiera cree campañas
        
        Campaign newCampaign = new Campaign(
            _title,
            _description,
            _image,
            _organization,
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