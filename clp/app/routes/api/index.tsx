
export const loader = async ({request}: {request: Request}) => {
   try {
    console.log('API Index')
      return new Response('Hello', {status: 404})
   }
   catch (error) {
     console.error(error)
     return new Response('Hello', {status: 500})
   }
}
