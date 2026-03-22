import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface Topic {
  id: number;
  title: string;
  category: "general" | "admin";
  steps: Step[];
}

const topics: Topic[] = [
  {
    id: 0,
    title: "建立訪視紀錄",
    category: "general",
    steps: [
      {
        title: "進入紀錄頁面",
        description: "點擊左側導覽列的「家電訪紀錄」，進入紀錄列表頁面。",
      },
      {
        title: "新增紀錄",
        description: "點擊右上角的「新增紀錄」按鈕，進入填寫表單頁面。",
      },
      {
        title: "選擇個案與訪視類型",
        description: "從下拉選單選擇個案姓名，並選擇訪視類型（家訪 / 電訪）。",
      },
      {
        title: "填寫各項段落",
        description: "依序填寫身心健康、居家安全、社會支持等段落內容。可使用語音輸入或照片 OCR 加速填寫。",
      },
      {
        title: "儲存紀錄",
        description: "填寫完成後，點擊「儲存」按鈕即完成建立。紀錄會出現在列表中，並可隨時編輯。",
      },
    ],
  },
  {
    id: 1,
    title: "語音輸入",
    category: "general",
    steps: [
      {
        title: "開啟語音輸入",
        description: "在紀錄表單的任一段落，點擊麥克風圖示按鈕，啟動語音錄音。",
      },
      {
        title: "開始錄音",
        description: "按鈕變紅表示正在錄音。請對著麥克風清楚說出內容，系統會即時顯示錄音時長。",
      },
      {
        title: "停止錄音",
        description: "再次點擊麥克風按鈕停止錄音，系統會自動將語音轉換為文字並填入該段落。",
      },
      {
        title: "確認與修改",
        description: "轉換結果填入後，可直接在文字框中修改或補充細節。",
      },
    ],
  },
  {
    id: 2,
    title: "照片 OCR",
    category: "general",
    steps: [
      {
        title: "開啟照片上傳",
        description: "在紀錄表單的任一段落，點擊相機圖示按鈕，開啟照片上傳功能。",
      },
      {
        title: "上傳手寫筆記",
        description: "選擇手機相簿中的照片，或直接拍攝手寫筆記。建議光線充足、字跡清晰以提高辨識率。",
      },
      {
        title: "等待辨識",
        description: "系統使用 AI 自動辨識照片中的文字，通常在幾秒內完成。",
      },
      {
        title: "確認辨識結果",
        description: "辨識完成的文字會填入段落，請仔細確認並修正辨識錯誤的部分。",
      },
    ],
  },
  {
    id: 3,
    title: "AI 智能潤稿",
    category: "general",
    steps: [
      {
        title: "填入草稿內容",
        description: "先在段落中填入初步的文字內容（可以是語音轉換或手動輸入的草稿）。",
      },
      {
        title: "點擊潤稿按鈕",
        description: "點擊段落旁的「AI 潤稿」按鈕，選擇輸出格式：條列式或敘述式。",
      },
      {
        title: "等待 AI 處理",
        description: "AI 會根據草稿內容自動整理成專業的社工紀錄格式，通常需要數秒。",
      },
      {
        title: "確認並採用結果",
        description: "AI 潤稿結果會顯示在預覽區，確認無誤後點擊「採用」，文字即更新到段落中。",
      },
    ],
  },
  {
    id: 4,
    title: "匯出紀錄",
    category: "general",
    steps: [
      {
        title: "進入紀錄列表",
        description: "點擊左側導覽列的「家電訪紀錄」，找到要匯出的紀錄。",
      },
      {
        title: "開啟匯出選單",
        description: "點擊紀錄右側的「...」選單，選擇「匯出」。",
      },
      {
        title: "選擇格式",
        description: "選擇匯出格式：PDF（適合列印與歸檔）或 Word（適合後續編輯）。",
      },
      {
        title: "下載檔案",
        description: "系統會自動產生檔案並開始下載。檔名包含個案姓名與訪視日期，方便歸檔管理。",
      },
    ],
  },
  {
    id: 5,
    title: "查看訪視歷程",
    category: "general",
    steps: [
      {
        title: "進入訪視歷程頁面",
        description: "點擊左側導覽列的「訪視歷程」，可查看所有個案的訪視紀錄列表。",
      },
      {
        title: "搜尋個案",
        description: "使用上方搜尋欄輸入個案姓名或 ID，快速篩選特定個案的紀錄。",
      },
      {
        title: "查看個案詳情",
        description: "點擊個案姓名，進入個案詳情頁，可看到所有歷次訪視紀錄的時間軸。",
      },
      {
        title: "比較不同期紀錄",
        description: "在時間軸中點擊任一筆紀錄，可查看完整內容，方便比較個案狀況的變化。",
      },
    ],
  },
  {
    id: 6,
    title: "排程管理",
    category: "general",
    steps: [
      {
        title: "進入排程管理",
        description: "點擊左側導覽列的「排程管理」，查看所有個案的訪視偏好與合規狀態。",
      },
      {
        title: "設定訪視偏好",
        description: "點擊個案旁的設定按鈕，可設定偏好訪視日期、時段與頻率（如每月一次）。",
      },
      {
        title: "追蹤合規狀態",
        description: "系統自動根據設定頻率計算下次應訪日期，並顯示「正常」、「即將逾期」或「已逾期」狀態。",
      },
      {
        title: "查看警示",
        description: "頁面頂部會顯示即將逾期或已逾期的個案清單，優先安排訪視以確保服務合規。",
      },
    ],
  },
  {
    id: 7,
    title: "AI 助理",
    category: "general",
    steps: [
      {
        title: "開啟 AI 助理",
        description: "點擊左側導覽列底部的「AI 助理」按鈕，或點擊右上角的對話圖示，開啟聊天面板。",
      },
      {
        title: "輸入問題",
        description: "在輸入框中以自然語言輸入問題，例如「張○○最近的訪視紀錄是什麼時候？」",
      },
      {
        title: "查看回覆",
        description: "AI 助理會根據系統資料回覆相關內容，並提供資料來源說明。",
      },
      {
        title: "深入查詢",
        description: "可繼續追問，或要求 AI 彙整特定時間範圍的紀錄、統計訪視次數等。",
      },
    ],
  },
  {
    id: 8,
    title: "個案管理",
    category: "admin",
    steps: [
      {
        title: "進入個案管理",
        description: "點擊左側導覽列的「個案管理」，查看所有個案資料列表。",
      },
      {
        title: "新增個案",
        description: "點擊右上角「新增個案」，填寫個案基本資料（姓名、身分證號、聯絡資訊等）後儲存。",
      },
      {
        title: "編輯個案資料",
        description: "點擊個案列表中的「編輯」按鈕，修改個案資料後點擊「儲存」。",
      },
      {
        title: "刪除個案",
        description: "點擊「刪除」按鈕並確認，即可移除個案資料。注意：刪除後無法復原，相關訪視紀錄將一併移除。",
      },
    ],
  },
  {
    id: 9,
    title: "批量匯入個案",
    category: "admin",
    steps: [
      {
        title: "下載匯入範本",
        description: "在個案管理頁面點擊「批量匯入」，下載 Excel 範本檔案。",
      },
      {
        title: "填寫範本",
        description: "按照範本格式填寫個案資料，每列代表一位個案。欄位包含姓名、身分證號、出生日期、聯絡電話等。",
      },
      {
        title: "上傳 Excel",
        description: "點擊「選擇檔案」上傳填寫好的 Excel 檔，系統會自動驗證資料格式。",
      },
      {
        title: "確認匯入結果",
        description: "系統顯示預覽列表，確認無誤後點擊「確認匯入」，所有個案資料即批次新增至系統。",
      },
    ],
  },
  {
    id: 10,
    title: "帳號管理",
    category: "admin",
    steps: [
      {
        title: "進入帳號管理",
        description: "點擊左側導覽列的「帳號管理」（僅管理員可見），查看所有社工帳號列表。",
      },
      {
        title: "新增社工帳號",
        description: "點擊「新增帳號」，填寫姓名、電子郵件與初始密碼，選擇角色（社工 / 管理員）後儲存。",
      },
      {
        title: "修改帳號權限",
        description: "點擊帳號旁的「編輯」，可修改角色或重設密碼。",
      },
      {
        title: "停用帳號",
        description: "點擊「停用」可暫停該帳號的登入權限，而不刪除歷史資料。再次點擊可重新啟用。",
      },
    ],
  },
  {
    id: 11,
    title: "稽核日誌",
    category: "admin",
    steps: [
      {
        title: "進入稽核日誌",
        description: "點擊左下角使用者欄位旁的「操作記錄」圖示，或透過管理員選單進入稽核日誌頁面。",
      },
      {
        title: "查看操作記錄",
        description: "頁面列出所有使用者的操作記錄，包含操作時間、操作人、操作類型（新增/編輯/刪除）與對象。",
      },
      {
        title: "篩選記錄",
        description: "可依日期範圍、操作人或操作類型篩選，快速找到特定時間段的操作記錄。",
      },
      {
        title: "匯出日誌",
        description: "點擊「匯出」可將稽核日誌匯出為 CSV 格式，供外部系統或主管查閱。",
      },
    ],
  },
];

const generalTopics = topics.filter((t) => t.category === "general");
const adminTopics = topics.filter((t) => t.category === "admin");

export default function TutorialPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(0);

  const selected = topics.find((t) => t.id === selectedId) ?? topics[0];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl font-bold text-gray-900">教學中心</h1>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar — desktop: vertical, mobile: horizontal scroll tabs */}
        <aside className="hidden md:flex flex-col w-52 flex-shrink-0 bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-y-auto">
          <div className="px-4 py-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">一般功能</p>
            {generalTopics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                  selectedId === t.id
                    ? "bg-amber-50 text-amber-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">管理功能</p>
            {adminTopics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                  selectedId === t.id
                    ? "bg-amber-50 text-amber-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile horizontal tabs */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-2 flex-shrink-0 w-full">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedId === t.id
                  ? "bg-amber-100 text-amber-700"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-y-auto p-6 hidden md:block">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{selected.title}</h2>
          <p className="text-xs text-gray-400 mb-6">
            {selected.category === "admin" ? "管理功能" : "一般功能"}
          </p>
          <ol className="space-y-5">
            {selected.steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Mobile content area */}
        <div className="md:hidden flex-1 bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-y-auto p-4">
          <h2 className="text-base font-bold text-gray-900 mb-1">{selected.title}</h2>
          <p className="text-xs text-gray-400 mb-4">
            {selected.category === "admin" ? "管理功能" : "一般功能"}
          </p>
          <ol className="space-y-4">
            {selected.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
