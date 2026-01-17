
import { log } from '../../utils/log'

export const loader = async ({request}: {request: Request}) => {
   try {
    log({ type: 'info', message: 'API Index' })
      return new Response('Hello', {status: 404})
   }
   catch (error) {
     log({
        type: 'error',
        message: 'API Index loader error',
        error: error instanceof Error ? error : new Error(String(error)),
     })
     return new Response('Hello', {status: 500})
   }
}
