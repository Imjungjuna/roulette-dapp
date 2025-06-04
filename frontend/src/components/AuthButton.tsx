import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3Auth,
} from "@web3auth/modal/react";

export function AuthButton() {
  const { connect } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const {
    // web3Auth, // Web3Auth 인스턴스, 필요시 사용
    isConnected,
    isInitializing, // SDK 초기화 중 여부
    status, // 상세 상태 ("connected", "connecting", "disconnected", "not_ready", "errored" 등)
    initError,
    provider, // 연결된 경우 provider 객체
  } = useWeb3Auth();

  // 디버깅을 위한 로그 (유지하셨던 코드)
  if (isInitializing) {
    console.log("Web3Auth is initializing");
  }
  if (status) {
    console.log("Web3Auth status:", status);
  }
  if (initError) {
    console.log("Web3Auth initialization error:", initError);
    // 사용자에게 UI로 에러를 표시하는 것을 고려해볼 수 있습니다.
    // return <p>Error: {initError.message}</p>;
  }

  // 로딩 중 상태 (SDK 초기화 중이거나, 연결/해제 시도 중)
  const isLoading =
    isInitializing || status === "connecting" || status === "disconnecting";

  // SDK가 아직 초기화 중일 경우
  if (isInitializing) {
    return <button disabled>초기화 중...</button>;
  }

  if (isConnected) {
    // 연결된 상태: 로그아웃 버튼 표시
    console.log("Connected with provider:", provider); // 유지하셨던 로그
    return (
      <>
        <button onClick={() => disconnect()} disabled={isLoading}>
          {status === "disconnecting" ? "로그아웃 중..." : "로그아웃"}
        </button>
      </>
    );
  } else {
    // 연결되지 않은 상태: 로그인 버튼 표시
    return (
      <button onClick={() => connect()} disabled={isLoading}>
        {status === "connecting" ? "로그인 중..." : "로그인"}
      </button>
    );
  }
}
