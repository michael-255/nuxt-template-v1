/**
 * Simulate a network request to perform a fake operation.
 */
export async function fakeOperation(record: Record<string, any>) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Record:', record)
      resolve(record)
    }, 1000)
  })
}
