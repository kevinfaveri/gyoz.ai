export function minifyString(str: string) {
  return str.replace(/[\n\r\t]+|\s{2,}/g, ' ').replace(/\s{2}/g, ' ')
}

function replaceAfterLastOccurrence(inputString: string) {
  const lastIndex = inputString.lastIndexOf('},')
  if (lastIndex !== -1) {
    return inputString.slice(0, lastIndex) + '}]'
  }
  return inputString
}

function patchJSONString(jsonString: string): string {
  try {
    JSON.parse(jsonString)
    return jsonString
  } catch (error) {
    if (
      error instanceof SyntaxError &&
      error.message.includes(`Expected ',' or '}'`)
    ) {
      jsonString += '}'
    }
    if (
      error instanceof SyntaxError &&
      error.message.includes(`Expected ',' or ']'`)
    ) {
      jsonString += ']'
    }
    if (
      error instanceof SyntaxError &&
      error.message.includes(`Unterminated string in JSON`)
    ) {
      jsonString += '"'
    }

    if (error instanceof SyntaxError && jsonString.includes('},')) {
      jsonString = replaceAfterLastOccurrence(jsonString)
    }
    return patchJSONString(jsonString)
  }
}

export function completeAndParseJSON(jsonString: string): any {
  jsonString = jsonString.trim()
  jsonString = jsonString.replace(/\n/g, '')
  if (/^\[\s*{\s*"type"\s*:\s*"text"\s*,\s*"text"\s*:\s*"/.test(jsonString)) {
    // If the string starts with the expected pattern, patch it
    jsonString = patchJSONString(jsonString)
  } else {
    // If the string doesn't start with the expected pattern, create a valid JSON string
    jsonString = '[{"type":"text", "text": ""}]'
  }
  // Parse the completed JSON string
  try {
    const parsedJSON = JSON.parse(jsonString)
    return parsedJSON
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return null
  }
}
