export default function scrollToBottom(elementId: string) {
  const observedElement = document.getElementById(elementId)
  if (observedElement) {
    observedElement.scrollTop = observedElement.scrollHeight
  }
}
