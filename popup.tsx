import { useState, useEffect } from "react"

function IndexPopup() {
  const [error, setError] = useState<string>("")

  const openOptionsPage = () => {
    try {
      if (chrome?.runtime?.openOptionsPage) {
        chrome.runtime.openOptionsPage()
      } else {
        window.open(chrome.runtime.getURL("options.html"), "_blank")
      }
    } catch (err) {
      console.error("Failed to open options page:", err)
      setError("設定ページを開けませんでした")
    }
  }

  if (error) {
    return <div style={{ padding: "1rem", color: "red" }}>{error}</div>
  }

  return (
    <div style={{ 
      padding: "0.75rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.75rem",
      minWidth: "200px"
    }}>
      <div style={{
        fontSize: "0.9rem",
        textAlign: "center",
        marginBottom: "8px"
      }}>
        Matrix 自動入力が有効です
      </div>
      
      <button 
        onClick={openOptionsPage}
        style={{
          fontSize: "0.875rem",
          padding: "8px 16px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          width: "100%"
        }}
      >
        マトリックス設定を開く
      </button>
    </div>
  )
}

export default IndexPopup
