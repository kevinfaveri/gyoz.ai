export function minifyString(str: string) {
  return str.replace(/[\n\r\t]+|\s{2,}/g, ' ').replace(/\s{2}/g, ' ')
}

export function completeJSON(incompleteStr: string): any {
  // Add initial checks and adjustments for the incomplete string
  if (!incompleteStr.trim().startsWith('{')) {
    incompleteStr = '{' + incompleteStr
  }

  if (!incompleteStr.includes('message')) {
    incompleteStr = '{"message": "", "tools": null}'
  } else {
    // Handling incomplete message value
    const messageKeyValue = incompleteStr.match(/"message"\s*:\s*"([^"]*)?$/)
    if (messageKeyValue) {
      incompleteStr = incompleteStr.replace(
        /"message"\s*:\s*"([^"]*)?$/,
        `"message": "${messageKeyValue[1] || ''}"`
      )
    } else {
      incompleteStr = incompleteStr.replace(
        /"message"\s*:\s*"([^"]*)?([^"]*)$/,
        `"message": "$1"`
      )
    }
  }

  // Close the JSON object
  if (!incompleteStr.trim().endsWith('}')) {
    incompleteStr += '}'
  }

  // Ensure the completeStr is a valid JSON
  try {
    JSON.parse(incompleteStr)
  } catch (e) {
    // If it's still not valid, return a dummy JSON string
    incompleteStr = '{"message": "", "tools": null}'
  }

  return JSON.parse(incompleteStr)
}
