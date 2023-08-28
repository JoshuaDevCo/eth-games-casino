export const truncateAddress = (address: string) => {
  if (!address) return 'No Account'
  const match = address.match(/^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{3})$/)
  if (!match) return address
  return `${match[1]}…${match[2]}`
}

export const toHex = (num: number) => {
  const val = Number(num)
  return '0x' + val.toString(16)
}
export const hexToDecimal = (hex: string) => parseInt(hex, 16)

export const fetcher = (...args: any) => {
  console.log(args, ' if fetcher')
  return fetch({ ...args }).then((res) => res.json())
}
