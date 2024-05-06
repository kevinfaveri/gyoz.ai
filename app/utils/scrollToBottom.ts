export default function scrollToBottom() {
  const chatElement = document.getElementById('chat')
  if (chatElement) {
    chatElement.scrollTop = chatElement.scrollHeight
  }
}
