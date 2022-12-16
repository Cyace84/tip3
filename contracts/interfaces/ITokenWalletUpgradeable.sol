pragma ton-solidity >= 0.57.0;

import "./ITokenWallet.sol";
import "./IVersioned.sol";

/**
 * @dev The interface extends the {ITokenWallet} defines a set of functions for
 * upgradable token wallets.
 */
interface ITokenWalletUpgradeable is ITokenWallet, IVersioned {
    /**
     * @notice Returns the code of functions implemented in TokenWalletPlatform.sol.
     */
    function platformCode() external view responsible returns (TvmCell);

    /**
     * @dev Sends a request to the TokenRoot to upgrade the Wallet code to
     * the latest version.
     *
     * @dev The wallet calls a method {requestUpgradeWallet}
     * the TokenRoot and then the root token calls `acceptUpdgeade`
     * of Token Wallet passing in the new wallet code.
     *
     * @param remainingGasTo The receipient of the remaining gas.
     *
     * Preconditions:
     *  - Caller must be the owner of the wallet.
     *  - The current version of the Wallet code must be not equal to the
     * latest version.
     */
    function upgrade(address remainingGasTo) external;

    /**
     * @dev The function is a callback that can be called by the TokenRoot
     * contract to upgrade the code of an upgradable token wallet to the
     * latest version.
     *
     * @notice Callback upgrades Wallet code to the latest version of the TokenRoot.walletCode_.
     * @notice Only TokenRoot can call this method.

     * @param code New Wallet code.
     * @param newVersion New Wallet version.
     * @param remainingGasTo The receipient of the remaining gas.
     *
     * Preconditions:
     *   - Caller must be the TokenRoot.
     *   - The current version of the Wallet code must be not equal
     *     to the new version.
     */
    function acceptUpgrade(TvmCell code, uint32 newVersion, address remainingGasTo) external;
}
