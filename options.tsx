import React, { useState, useEffect } from "react"
import { Storage } from "@plasmohq/Storage"

const rowLabels = ["1", "2", "3", "4", "5", "6", "7"]
const colLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
const defaultMatrix = Array.from({ length: 7 }, () => Array(10).fill(""))

function OptionsPage() {
  const [matrix, setMatrix] = useState(defaultMatrix)
  const [status, setStatus] = useState("")
  const saveButtonRef = React.useRef<HTMLButtonElement>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const saved = await new Storage().get("matrix")
        if (saved) {
          setMatrix((saved as unknown) as string[][])
        }
      } catch (error) {
        console.error("Error loading matrix data:", error)
      }
    })()
  }, [])

  const handleChange = (row: number, col: number, value: string) => {
    const singleChar = value.substring(0, 1)
    
    const updated = [...matrix]
    updated[row][col] = singleChar
    setMatrix(updated)

    if (singleChar) {
      focusNextCell(row, col)
    }
  }

  const focusNextCell = (currentRow: number, currentCol: number) => {
    let nextRow = currentRow
    let nextCol = currentCol + 1
    if (nextCol >= colLabels.length) {
      nextCol = 0
      nextRow++
    }
    if (nextRow >= rowLabels.length) {
      saveButtonRef.current?.focus()
      return
    }
    
    const nextInput = document.getElementById(`cell-${nextRow}-${nextCol}`)
    if (nextInput) {
      nextInput.focus()
    }
  }

  const handleSave = async () => {
    try {
      await new Storage().set("matrix", matrix)
      setStatus("マトリックスデータを保存しました！")
      setTimeout(() => setStatus(""), 3000)
    } catch (error) {
      setStatus("保存に失敗しました。")
      console.error("Error saving matrix data:", error)
    }
  }

  const handleReset = () => {
    if (confirm("本当にリセットしますか？")) {
      const emptyMatrix = Array.from({ length: 7 }, () => Array(10).fill(""))
      setMatrix(emptyMatrix)
      setStatus("マトリックスデータをリセットしました！")
      setTimeout(() => setStatus(""), 3000)
    }
  }

  return (
    <div style={{ padding: "10px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333", fontSize: "1.5rem" }}>マトリックス認証の設定</h1>
      <p style={{ fontSize: "0.9rem" }}>下記のマトリックス表に認証用のデータを入力してください。各セルに1文字ずつ入力できます。</p>
      
      {status && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#d4edda", 
          color: "#155724",
          borderRadius: "4px",
          marginBottom: "15px"
        }}>
          {status}
        </div>
      )}
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ 
          borderCollapse: "collapse", 
          width: "auto",
          textAlign: "center",
          fontSize: "0.8rem"
        }}>
          <thead>
            <tr>
              <th style={{ padding: "4px", border: "1px solid #ddd" }}></th>
              {colLabels.map(label => (
                <th key={label} style={{ padding: "4px", border: "1px solid #ddd" }}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "4px", border: "1px solid #ddd", fontWeight: "bold" }}>{rowLabels[i]}</td>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "2px", border: "1px solid #ddd" }}>
                    <input
                      id={`cell-${i}-${j}`}
                      type="text"
                      value={cell}
                      onChange={e => handleChange(i, j, e.target.value)}
                      style={{
                        width: "30px",
                        padding: "2px",
                        textAlign: "center",
                        fontSize: "0.8rem"
                      }}
                      maxLength={1}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ 
        display: "flex", 
        gap: "10px",
        marginTop: "15px"
      }}>
        <button 
          ref={saveButtonRef}
          onClick={handleSave}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem"
          }}
        >
          保存
        </button>
        
        <button
          onClick={handleReset}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem"
          }}
        >
          リセット
        </button>
      </div>
    </div>
  )
}

export default OptionsPage
