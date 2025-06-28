const TodoRouletteCard = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-5"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        background:
          "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 flex flex-col gap-4">
          <div className="flex gap-6 items-stretch max-md:flex-col max-md:gap-4">
            {/* Left Section - Today's Pick */}
            <div
              className="flex-1 rounded-xl p-6 text-white text-center flex flex-col justify-center min-h-32 max-md:min-h-24 max-md:p-4"
              style={{
                background:
                  "linear-gradient(135deg, #667eea, #764ba2)",
              }}
            >
              <div className="text-3xl mb-2">🧹</div>
              <div className="text-xl font-semibold mb-1 leading-tight">
                방 정리하기
              </div>
              <div className="text-xs opacity-90 uppercase tracking-wide">
                Today's Pick
              </div>
            </div>

            {/* Right Section - Forget for Now */}
            <div
              className="flex-1 flex flex-col"
              style={{ flex: "1.2" }}
            >
              <div className="text-xs text-gray-500 mb-3 font-semibold text-center pb-2 border-b-2 border-gray-200 uppercase tracking-wide">
                Forget for Now
              </div>

              <div className="space-y-2">
                {[
                  "운동 30분",
                  "책 한 챕터 읽기",
                  "일기 쓰기",
                  "새로운 레시피 시도",
                  "친구에게 연락하기",
                ].map((task, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg text-sm text-gray-600 border border-gray-200 relative overflow-hidden transition-all duration-200 hover:translate-x-1 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200"
                    style={{
                      background:
                        "linear-gradient(90deg, #f7fafc, #edf2f7)",
                      position: "relative",
                    }}
                    // onMouseEnter={(e) => {
                    //   const before =
                    //     e.currentTarget.querySelector(".border-accent");
                    //   if (before) {
                    //     before.style.background = "#667eea";
                    //     before.style.width = "6px";
                    //   }
                    // }}
                    // onMouseLeave={(e) => {
                    //   const before =
                    //     e.currentTarget.querySelector(".border-accent");
                    //   if (before) {
                    //     before.style.background = "#cbd5e0";
                    //     before.style.width = "3px";
                    //   }
                    // }}
                  >
                    <div
                      className="border-accent absolute left-0 top-0 h-full w-1 bg-gray-300 transition-all duration-200"
                      style={{
                        width: "3px",
                        background: "#cbd5e0",
                      }}
                    />
                    {task}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timestamp Section */}
          <div className="text-center pt-4 border-t border-gray-200 text-gray-500 text-sm">
            <div className="font-semibold text-gray-600 mb-1">
              2024.06.15 14시 32분에 돌렸습니다.
            </div>
            <div className="text-xs text-gray-400">
              @2025 Made by CoMit💜
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoRouletteCard;
