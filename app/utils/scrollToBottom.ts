export default function scrollToBottom(elementId: string) {
  const elementToScroll = document.getElementById(elementId)
  if (elementToScroll) {
    elementToScroll.scrollTop = elementToScroll.scrollHeight
  }
}
