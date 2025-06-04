import { useWalletUI } from "@web3auth/modal/react";

export default function WalletUIButton() {
  const { showWalletUI, loading, error } = useWalletUI();

  return (
    <button onClick={() => showWalletUI()} disabled={loading}>
      {loading ? "Opening Wallet UI..." : "Show Wallet UI"}
    </button>
  );
}
