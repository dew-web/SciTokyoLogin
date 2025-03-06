import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/Storage"

export const config: PlasmoCSConfig = {
  matches: ["https://portal.nap.gsic.titech.ac.jp/GetAccess/Login"],
  all_frames: true,
  run_at: "document_idle"
}

const runAutoFill = async () => {
  console.log("Matrix auto-fill script started")
  
  const infoDiv = document.createElement("div")
  infoDiv.textContent = "自動ログインを行なっています..."
  infoDiv.style.position = "fixed"
  infoDiv.style.bottom = "0"
  infoDiv.style.left = "0"
  infoDiv.style.width = "100%"
  infoDiv.style.background = "#ffffe0"
  infoDiv.style.padding = "10px"
  infoDiv.style.textAlign = "center"
  infoDiv.style.fontSize = "1rem"
  infoDiv.style.zIndex = "9999"
  document.body.appendChild(infoDiv)
  
  try {
    const storage = new Storage()
    
    console.log("Matrix auto-fill is enabled, proceeding with auto-fill...")

    const matrix = await storage.get("matrix")
    if (!matrix) {
      console.warn("Matrix is not set.")
      infoDiv.remove()
      return
    }
    console.log("Matrix data loaded successfully")
    
    const form = document.querySelector("form[name='login']")
    if (!form) {
      console.warn("Login form not found")
      infoDiv.remove()
      return
    }
    
    const coordCells = Array.from(document.querySelectorAll("th")).filter(th => 
      th.textContent && /\[([A-J]),\s*([1-7])\]/.test(th.textContent)
    )
    
    if (coordCells.length === 0) {
      console.warn("No coordinate cells found")
      infoDiv.remove()
      return
    }
    console.log(`Found ${coordCells.length} coordinate cells`)
    
    for (let i = 0; i < coordCells.length; i++) {
      const th = coordCells[i]
      const coordMatch = th.textContent.match(/\[([A-J]),\s*([1-7])\]/)
      if (!coordMatch) continue
      
      const colChar = coordMatch[1]
      const rowNum = parseInt(coordMatch[2], 10)
      
      const row = th.closest("tr")
      const inputField = row?.querySelector("input[type='password']") as HTMLInputElement
      
      if (!inputField) {
        console.warn(`No password field found for coordinate [${colChar},${rowNum}]`)
        continue
      }
      
      const rowIndex = rowNum - 1  // 1-7 -> 0-6
      const colIndex = colChar.charCodeAt(0) - 'A'.charCodeAt(0)  // A-J -> 0-9
      
      try {
        const value = matrix[rowIndex]?.[colIndex]
        if (value) {
          inputField.value = value
          console.log(`Input value for [${colChar},${rowNum}]`)
        } else {
          console.warn(`No value in matrix for [${colChar},${rowNum}]`)
        }
      } catch (err) {
        console.error(`Error accessing matrix:`, err)
      }
    }
    
    const submitButton = document.querySelector("input[type='submit']") as HTMLInputElement
    if (submitButton) {
      console.log("Found submit button, clicking...")
      setTimeout(() => {
        submitButton.click()
        infoDiv.remove()
      }, 500)
    } else {
      console.warn("Submit button not found")
      infoDiv.remove()
    }
  } catch (error) {
    console.error("Error during matrix auto-fill:", error)
    infoDiv.remove()
  }
}

let hasRun = false
const runOnce = () => {
  if (!hasRun) {
    hasRun = true
    setTimeout(runAutoFill, 500)
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runOnce)
} else {
  runOnce()
}