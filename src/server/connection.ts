let db: IDBDatabase | null = null
const dbName = import.meta.env.VITE_GAME_NAME

const connect = () => {
  return new Promise(resolve => {
    const connection = indexedDB.open(dbName, 1)

    connection.onsuccess = (e: Event) => {
      db = (e.target as IDBOpenDBRequest).result
      resolve(db)
    }

    connection.onupgradeneeded = (e: Event) => {
      db = (e.target as IDBOpenDBRequest).result
      db.createObjectStore('users', { keyPath: 'id', autoIncrement: true })
    }
  })
}

const operate = async (table: string, getRequest: (store: IDBObjectStore) => IDBRequest<any>) => {
  if (!db) {
    await connect()
    if (!db) { throw new Error('indexedDB connection failed.') }
  }

  const transaction = db.transaction([table], 'readwrite')
  const store = transaction.objectStore(table)
  const request = getRequest(store)

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result)
    }
    request.onerror = () => {
      reject('indexedDB error.')
    }
  })
}

export const getModel = (table: string) => {
  return {
    add(...args: Parameters<IDBObjectStore['add']>) {
      return operate(table, store => store.add(...args))
    },
    get(...args: Parameters<IDBObjectStore['get']>) {
      return operate(table, store => store.get(...args))
    },
    getAll(...args: Parameters<IDBObjectStore['getAll']>) {
      return operate(table, store => store.getAll(...args))
    },
    delete(...args: Parameters<IDBObjectStore['delete']>) {
      return operate(table, store => store.delete(...args))
    },
    put(...args: Parameters<IDBObjectStore['put']>) {
      return operate(table, store => store.put(...args))
    },
  }
}
