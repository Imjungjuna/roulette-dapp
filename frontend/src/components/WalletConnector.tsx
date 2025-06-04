//Web3Auth 인스턴스를 가지고 상태를 부모(App.tsx)에게 전달
import { useState, useEffect, useCallback } from "react";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { type SafeEventEmitterProvider } from "@web3auth/base";
import { ethers } from "ethers"; // 스마트 계약 연동 및 잔액 확인 등에 사용
import { WEB3AUTH_CLIENT_ID } from "../config/web3auth.config";

interface WalletConnectorProps {
  userAddress: string | null;
  setUserAddress: (address: string | null) => void;
  setIsLoadingAuth: (loading: boolean) => void;
  isLoadingAuth: boolean; // App.tsx로부터 받는 초기 로딩 상태
  // 추가적으로 provider, signer 등을 App.tsx로 전달할 수 있도록 콜백 함수 추가 가능
  // setWeb3Provider: (provider: ethers.providers.Web3Provider | null) => void;
}

const WalletConnector: React.FC<WalletConnectorProps> = ({
  userAddress,
  setUserAddress,
  setIsLoadingAuth,
  isLoadingAuth,
  // setWeb3Provider
}) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  // WalletConnector 내부 로딩 상태 (버튼 클릭 시 등)
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  useEffect(() => {
    const initWeb3Auth = async () => {
      if (!WEB3AUTH_CLIENT_ID) {
        console.error("VITE_WEB3AUTH_CLIENT_ID is not set in .env file!");
        setIsLoadingAuth(false);
        return;
      }
      try {
        setIsLoadingAuth(true);
        const web3AuthInstance = new Web3Auth({
          clientId: WEB3AUTH_CLIENT_ID,
          web3AuthNetwork: "sapphire_devnet", // 또는 "sapphire_mainnet", "testnet"(deprecated)
          uiConfig: {
            appName: "My Roulette DApp",
            loginMethodsOrder: ["google", "email_passwordless"],
          },
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "default", // none, default, optional, mandatory, voluntary
          },
          adapterSettings: {
            uxMode: "popup", // "redirect" 또는 "popup"
            whiteLabel: {
              logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
              defaultLanguage: "ko", // 한국어 지원
            },
          },
        });
        setWeb3auth(web3AuthInstance);

        // 이미 로그인된 세션이 있는지 확인
        if (web3AuthInstance.provider) {
          const web3Provider = new ethers.BrowserProvider(
            web3AuthInstance.provider as SafeEventEmitterProvider
          );
          const signer = await web3Provider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
          // setWeb3Provider(web3Provider); // App.tsx로 provider 전달
        }
      } catch (error) {
        console.error("Web3Auth initialization failed:", error);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    initWeb3Auth();
  }, [setUserAddress, setIsLoadingAuth]); // setWeb3Provider 도 의존성에 추가

  const handleLogin = useCallback(async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized yet");
      return;
    }
    setIsConnecting(true);
    try {
      const web3authProvider = await web3auth.connect(); // 로그인 시도
      if (web3authProvider) {
        const ethersProvider = new ethers.BrowserProvider(
          web3authProvider as SafeEventEmitterProvider
        );
        const signer = await ethersProvider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
        // setWeb3Provider(ethersProvider);
        console.log("Logged in with address:", address);
      }
    } catch (error) {
      console.error("Web3Auth login failed:", error);
      // 사용자에게 오류 메시지 표시 (예: toast 라이브러리 사용)
    } finally {
      setIsConnecting(false);
    }
  }, [web3auth, setUserAddress]); // setWeb3Provider

  const handleLogout = useCallback(async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized yet");
      return;
    }
    setIsConnecting(true);
    try {
      await web3auth.logout();
      setUserAddress(null);
      // setWeb3Provider(null);
      console.log("Logged out");
    } catch (error) {
      console.error("Web3Auth logout failed:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [web3auth, setUserAddress]); // setWeb3Provider

  // App.tsx에서 전달받은 isLoadingAuth는 초기화 로딩에 사용
  // isConnecting은 이 컴포넌트 내의 로그인/로그아웃 버튼 클릭 시 사용
  const currentLoadingState = isLoadingAuth || isConnecting;

  return (
    <div>
      {userAddress ? (
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-medium text-emerald-400 truncate max-w-[100px] sm:max-w-[150px]"
            title={userAddress}
          >
            {userAddress.substring(0, 6)}...
            {userAddress.substring(userAddress.length - 4)}
          </span>
          <button
            onClick={handleLogout}
            disabled={currentLoadingState}
            className="px-4 py-2 text-sm font-semibold bg-pink-600 hover:bg-pink-700 rounded-md transition-colors disabled:opacity-70"
          >
            {currentLoadingState && userAddress ? "로딩..." : "로그아웃"}
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          disabled={currentLoadingState}
          className="px-4 py-2 text-sm font-semibold bg-sky-500 hover:bg-sky-600 rounded-md transition-colors disabled:opacity-70"
        >
          {currentLoadingState && !userAddress
            ? "로딩..."
            : "로그인 (Google/Email)"}
        </button>
      )}
    </div>
  );
};

export default WalletConnector;
