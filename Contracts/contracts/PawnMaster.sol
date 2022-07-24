// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import  "./StableToken.sol";

contract PawnMaster is ReentrancyGuard,Ownable {
    event CreateVault(uint256 vaultId, address owner);
    event DepositCollateral(uint256 vaultID, uint256 amount);
    event BorrowToken(uint256 vaultID, uint256 amount);
    event Repayment(uint256 vaultId, uint256 amount);
    event Invest(uint256 depositId, uint256 amount, uint256 timePeriod);
    event Withdraw(uint256 depositId, uint256 amount, uint256 time);

    uint256 public depositId;
    uint256 public vaultCount;
    uint256 public protocolIntrst;
    uint256 public investorIntrst;
    StableToken  public stableCoin;

    mapping(address => uint256) oraclePrice;

    enum VaultStatus {
        active,
        borrowed,
        closed,
        liquidated
    }

    struct vaultDetails {
        address owner;
        address token;
        uint256 collateralAmount;
        uint256 debt;
        uint256 timelimit;
        VaultStatus status;
    }

    struct InvestmentDetails {
        address investor;
        uint256 investmentAmount;
        uint256 timePeriod;
    }

    mapping(uint256 => vaultDetails) public vault;
    mapping(uint256 => InvestmentDetails)public  investors;
    mapping(address => uint) public  liquidatedCollateral;

    constructor(uint256 _protocolIntrst,uint256 _investorIntrst) {
        stableCoin=new StableToken("Neuron","NRN");
        require(_protocolIntrst >_investorIntrst,"Intrst rate mismatch");
        protocolIntrst=_protocolIntrst;
        investorIntrst=_investorIntrst;
    }

    /// @notice Create Vault for depositing collateral
    /// @dev Explain to a developer any extra details
    /// @param _token address of collateral token
    /// @param _amount amount of collateral token
    function createVault(address _token, uint256 _amount) external {
        vaultCount++;
        uint256 id = vaultCount;
        vault[id].owner = msg.sender;
        vault[id].token = _token;
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        vault[id].collateralAmount += _amount;
        emit CreateVault(id, msg.sender);
    }

/// @notice Borrows stable coin with collateral token
/// @param vaultID id of vault
/// @param timelimit loan ending time in unix timestamp format
    function borrowToken(uint256 vaultID, uint256 timelimit) public {
        require(vaultID!=0,"Id:cannot be zero");
        vaultDetails memory vaultData;
        vaultData = vault[vaultID];
        require(msg.sender == vaultData.owner, "caller is not owner");
        require(
            vaultData.status != VaultStatus.borrowed &&
                vaultData.status != VaultStatus.closed &&
                vaultData.status != VaultStatus.liquidated,
            "cant borrow"
        );
        uint256 amountOut;
        uint256 _currentOraclePrice = oraclePrice[vaultData.token];
        uint256 vaultBalance = IERC20(vaultData.token).balanceOf(msg.sender);
        uint256 _maxLimit = vaultData.collateralAmount * _currentOraclePrice;
        if (vaultBalance >= _maxLimit) {
            amountOut = _maxLimit;
        } else {
            amountOut = vaultBalance;
        }
        uint intrstAmount=(amountOut * protocolIntrst) / 10000;
        vault[vaultID].debt+=intrstAmount;
        vault[vaultID].timelimit = timelimit;
        vault[vaultID].status = VaultStatus.borrowed;
        IERC20(stableCoin).transfer(msg.sender, amountOut);
        emit BorrowToken(vaultID, amountOut);
    }

/// @notice Returns Maximum amount to borrow from a vault
/// @param vaultID id of vault
/// @return maximum amountOut
/// @inheritdoc	Copies all missing tags from the base function (must be followed by the contract name)
    function getMaxBorrowAmount(uint256 vaultID) public view returns(uint){
        vaultDetails memory vaultData;
        vaultData = vault[vaultID];
        uint amountOut;
         uint256 _currentOraclePrice = oraclePrice[vaultData.token];
        uint256 vaultBalance = IERC20(vaultData.token).balanceOf(msg.sender);
        uint256 _maxLimit = vaultData.collateralAmount * _currentOraclePrice;
        if (vaultBalance >= _maxLimit) {
            amountOut = _maxLimit;
        } else {
            amountOut = vaultBalance;
        }
        return amountOut;
    }

/// @notice Payback Loan Amount
/// @param vaultID id of vault
    function repayToken(uint256 vaultId) external {
        vaultDetails memory vaultData;
        vaultData = vault[vaultId];
        require(msg.sender==vaultData.owner,"caller is not owner");
        require(vaultData.status != VaultStatus.closed && vaultData.status != VaultStatus.liquidated, "cant repay");
        IERC20(stableCoin).transferFrom(msg.sender, address(this), vaultData.debt);
        IERC20(vaultData.token).transfer(msg.sender, vaultData.collateralAmount);
        vaultData.status = VaultStatus.closed;
        emit Repayment(vaultId, vaultData.debt);
    }

/// @notice Depositing Function
/// @param _amount Stable coin investing amount
    function invest(uint256 _amount, uint256 _timePeriod) external {
        IERC20(stableCoin).transferFrom(msg.sender, address(this), _amount);
        depositId++;
        investors[depositId].investmentAmount += _amount;
        investors[depositId].investor = msg.sender;
        investors[depositId].timePeriod = _timePeriod;
        emit Invest(depositId, _amount, _timePeriod);
    }

/// @notice WithDraws Invested Stable coin with interest
/// @dev Explain to a developer any extra details
/// @param _depositId deposit token Id
/// @return Documents the return variables of a contract’s function state variable
/// @inheritdoc	Copies all missing tags from the base function (must be followed by the contract name)
    function withdraw(uint256 _depositId) external {
        InvestmentDetails memory depositData;
        depositData = investors[_depositId];
        require(msg.sender == depositData.investor, "Caller is not Owner");
        require(depositData.timePeriod < block.timestamp, " withdraw:Too Early to Withdraw");
        uint256 vaultBalance = IERC20(stableCoin).balanceOf(address(this));
        uint intrstAmount=(depositData.investmentAmount * investorIntrst) / 10000;
        uint256 withdrawAmount = depositData.investmentAmount + intrstAmount;
        require(vaultBalance >= withdrawAmount, "Low balance:wait for liquidation process");
        IERC20(stableCoin).transfer(msg.sender, withdrawAmount);
        emit Withdraw(_depositId, withdrawAmount, block.timestamp);
    }

/// @notice Function to Liquidate Expired Vault/Risky Vault
/// @param _vaultId vault Id
    function LiquidateVault(uint256 _vaultId) external {
        vaultDetails memory vaultData;
        vaultData = vault[_vaultId];
        require(vaultData.status != VaultStatus.liquidated, "cant liquidate");
        require(vaultData.timelimit<block.timestamp,"Too early to liquidate");
        vaultData.status=VaultStatus.liquidated;
        stableCoin.mint(address(this),vaultData.debt);
        liquidatedCollateral[vaultData.token]=vaultData.debt;

    }

/// @notice Withdraws Liquidated Assets
/// @param _token address of token to withdraw
/// @return Documents the return variables of a contract’s function state variable
    function WithdrawLiquidatedAssets(address _token) external onlyOwner{
        uint amountOut=liquidatedCollateral[_token];
        IERC20(_token).transfer(msg.sender, amountOut);
    }

/// @notice Function to Mint stable coins for
/// @param amount amount to mint
/// @param receipient recepient address


/// @param Documents a parameter just like in doxygen (must be followed by parameter name)
/// @inheritdoc	Copies all missing tags from the base function (must be followed by the contract name)
    function mintStables(uint amount,address receipient) external onlyOwner{
        stableCoin.mint(receipient,amount);
    }

/// @notice Sets Oracle price for development purpose
/// @dev remove and oracle contract to update state
/// @param _token address of collateral Token
/// @param _price price of token
    function setPrice(address _token, uint256 _price) external {
        require(_price!=0,"Price:cant be zero");
        oraclePrice[_token] = _price;
    }
}
