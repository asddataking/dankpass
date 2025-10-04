import { StackHandler } from '@stackframe/stack'
import { stackServerApp } from '@/lib/stack'

export const { GET, POST } = StackHandler(stackServerApp)
