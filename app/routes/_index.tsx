import { type MetaFunction } from '@remix-run/node'
import ActionBar from '~/components/features/actionbar'
import Topbar from '~/components/features/topbar'
import { ChatStateProvider } from '~/hooks/useChatState'

export const meta: MetaFunction = () => {
  return [
    { title: 'Gyoza OS' },
    {
      name: 'description',
      content: 'Ask around, find out. DeFi made simple.',
    },
  ]
}

export default function Index() {
  return (
    <div className="h-full">
      <ChatStateProvider>
        <div className="flex justify-center h-full">
          <Topbar />
          <div className="w-[70%] flex flex-col items-center justify-center">
            <div className="w-[50%] flex flex-col items-center justify-center">
              <ActionBar />
            </div>
          </div>
        </div>
      </ChatStateProvider>
    </div>
  )
}
