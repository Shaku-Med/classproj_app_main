import { createClient } from '@supabase/supabase-js';
import { EnvValidator } from '../EnvValidator';

const supabaseUrl: string = EnvValidator(`SUPABASE_URL`) || '';
const supabaseKey: string = EnvValidator(`SUPABASE_ANON_KEY`) || '';

let db: any = null;

const createChainableFallback = () => {
  const errorResponse = { data: null, error: new Error('Supabase client not initialized') };
  const errorPromise = Promise.resolve(errorResponse);
  
  const createChainable = (): any => {
    const chainable: any = {
      select: () => createChainable(),
      insert: () => createChainable(),
      update: () => createChainable(),
      delete: () => createChainable(),
      upsert: () => createChainable(),
      eq: () => createChainable(),
      neq: () => createChainable(),
      in: () => createChainable(),
      not: () => createChainable(),
      like: () => createChainable(),
      ilike: () => createChainable(),
      or: () => createChainable(),
      order: () => createChainable(),
      limit: () => createChainable(),
      range: () => createChainable(),
      is: () => createChainable(),
      gte: () => createChainable(),
      lte: () => createChainable(),
      gt: () => createChainable(),
      lt: () => createChainable(),
      single: () => errorPromise,
      maybeSingle: () => errorPromise,
    };
    
    chainable.then = errorPromise.then.bind(errorPromise);
    chainable.catch = errorPromise.catch.bind(errorPromise);
    chainable.finally = errorPromise.finally?.bind(errorPromise);
    
    return chainable;
  };
  
  return createChainable();
};

try {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials are missing. Using fallback client.');
    db = {
      from: () => createChainableFallback(),
      rpc: () => Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
    };
  } else {
    try {
      db = createClient(supabaseUrl, supabaseKey);
      if (!db || typeof db.from !== 'function') {
        throw new Error('Invalid Supabase client');
      }
    } catch (clientError) {
      console.warn('Supabase client creation failed:', clientError);
      db = {
        from: () => createChainableFallback(),
        rpc: () => Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
      };
    }
  }
} catch (error) {
  console.warn('Supabase client initialization failed:', error);
  db = {
    from: () => createChainableFallback(),
    rpc: () => Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
  };
}

if (!db || typeof db.from !== 'function') {
  db = {
    from: () => createChainableFallback(),
    rpc: () => Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
  };
}

export default db;
