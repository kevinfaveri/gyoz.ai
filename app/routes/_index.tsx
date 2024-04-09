import { type MetaFunction } from '@remix-run/node'
import ActionBar from '~/components/features/actionbar'
import { Chatbox } from '~/components/features/chatbox/chatbox'
import Topbar from '~/components/features/topbar'
import { ChatStateProvider } from '~/hooks/useChatState'

export const meta: MetaFunction = () => {
  return [
    { title: 'Gyoza OS' },
    {
      name: 'description',
      content: 'Chat around, find out. DeFi made simple.',
    },
  ]
}

export default function Index() {
  return (
    <div>
      <ChatStateProvider>
        <div className="flex justify-center">
          <Topbar />
          <div className="absolute bottom-0 w-[70%] flex flex-col justify-center">
            <Chatbox />
            <ActionBar />
          </div>
        </div>
      </ChatStateProvider>
    </div>
  )
}
