
window.neo3Dapi_save = ''
window.isNeoLine = true

let initResult
const BET_CONTRACT = '0x70eec13e22e13b2acc1d67e79d63b0c23823d5b9'
export default {
  BET_CONTRACT
}
export function init() {
  return new Promise((resovle, reject) => {
    function onReady() {
      if (!window.NEOLineN3) { return }
      const neo3Dapi = new window.NEOLineN3.Init()
      return resovle({ neo3Dapi })
    }
    onReady()
    window.addEventListener('NEOLine.N3.EVENT.READY', onReady)
    setTimeout(() => {
      reject(new Error('neoline not installed!'))
    }, 3000)
  }).catch((err) =>
    window.isNeoLine = false
  )
}
export function getNeoDapiInstances() {
  if (!initResult) {
    initResult = init()
  }
  return initResult
}

export async function connect() {
  const client = (await getNeoDapiInstances()).neo3Dapi
  return client
}

export async function bet(pool_id, option, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invoke({
    scriptHash: BET_CONTRACT,
    operation: 'bet',
    args: [{
      type: 'Address',
      value: result.address
    },
    {
      type: 'ByteArray',
      value: pool_id
    },
    {
      type: 'Integer',
      value: option
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 128
    }
    ]
  })
  return response
}

export async function test_bet(pool_id, option, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  console.log(result)
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })

  const response = await neo3Dapi.invokeRead({
    scriptHash: BET_CONTRACT,
    operation: 'bet',
    args: [{
      type: 'Address',
      value: result.address
    },
    {
      type: 'ByteArray',
      value: pool_id
    },
    {
      type: 'Integer',
      value: option
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 128
    }
    ]
  })
  if (response.state === 'FAULT') {
    return {
      'message': 'error',
      'data': response.exception.slice(35),
      'state': false
    }
  } else {
    return {
      'state': true
    }
  }
}

export async function cancel_bet(pool_id, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invoke({
    scriptHash: BET_CONTRACT,
    operation: 'cancel_bet',
    args: [{
      type: 'Address',
      value: result.address
    },
    {
      type: 'Hash256',
      value: pool_id
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 128
    }
    ]
  })
  return response
}

export async function test_cancel_bet(pool_id, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invokeRead({
    scriptHash: BET_CONTRACT,
    operation: 'cancel_bet',
    args: [{
      type: 'Address',
      value: result.address
    },
    {
      type: 'Hash256',
      value: pool_id
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 128
    }
    ]
  })
  if (response.state === 'FAULT') {
    alert('Oops! There seems to be an error!\n' + response.exception.slice(35))
    return false
  } else return true
}
export async function pool_init(token_id, url, json_filter, margin, expiry, threshold, deposit, strike, description, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invoke({
    scriptHash: BET_CONTRACT,
    operation: 'pool_init',
    args: [{
      type: 'Address',
      value: result.address
    },
    {
      type: 'Integer',
      value: token_id
    },
    {
      type: 'String',
      value: url
    },
    {
      type: 'String',
      value: json_filter
    },
    {
      type: 'Integer',
      value: margin
    },
    {
      type: 'Integer',
      value: expiry
    },
    {
      type: 'Integer',
      value: threshold
    },
    {
      type: 'Integer',
      value: deposit
    },
    {
      type: 'String',
      value: strike
    },
    {
      type: 'String',
      value: description
    }

    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 128
    }
    ]
  })
  return {
    'message': 'success',
    'data': 'Your pool_id is: ' + response.txid
  }
}

export async function test_pool_init(token_id, url, json_filter, margin, expiry, threshold, deposit, strike, description, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invokeRead({
    scriptHash: BET_CONTRACT,
    operation: 'pool_init',
    args: [{
      type: 'Address',
      value: result.address
    },
    {
      type: 'Integer',
      value: token_id
    },
    {
      type: 'String',
      value: url
    },
    {
      type: 'String',
      value: json_filter
    },
    {
      type: 'Integer',
      value: margin
    },
    {
      type: 'Integer',
      value: expiry
    },
    {
      type: 'Integer',
      value: threshold
    },
    {
      type: 'Integer',
      value: deposit
    },
    {
      type: 'String',
      value: strike
    },
    {
      type: 'String',
      value: description
    }

    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 128
    }
    ]
  })
  if (response.state === 'FAULT') {
    return {
      'message': 'error',
      'data': response.exception.slice(35),
      'state': false
    }
  } else {
    return {
      'state': true
    }
  }
}
export async function cancel_pool(pool_id, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invoke({
    scriptHash: BET_CONTRACT,
    operation: 'cancel_pool',
    args: [{
      type: 'ByteArray',
      value: pool_id
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 1
    }
    ]
  })
  return response
}

export async function test_cancel_pool(pool_id, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invokeRead({
    scriptHash: BET_CONTRACT,
    operation: 'cancel_pool',
    args: [{
      type: 'ByteArray',
      value: pool_id
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 1
    }
    ]
  })
  if (response.state === 'FAULT') {
    return {
      'message': 'error',
      'data': response.exception.slice(35),
      'state': false
    }
  } else {
    return {
      'state': true
    }
  }
}

export async function oracle_call(pool_id, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invoke({
    scriptHash: BET_CONTRACT,
    operation: 'oracle_call',
    args: [{
      type: 'ByteArray',
      value: pool_id
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 1
    }
    ]
  })
  return response
}

export async function test_oracle_call(pool_id, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invokeRead({
    scriptHash: BET_CONTRACT,
    operation: 'oracle_call',
    args: [{
      type: 'ByteArray',
      value: pool_id
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 1
    }
    ]
  })
  if (response.state === 'FAULT') {
    return {
      'message': 'error',
      'data': response.exception.slice(35),
      'state': false
    }
  } else {
    return {
      'state': true
    }
  }
}

export async function payout(pool_id, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invoke({
    scriptHash: BET_CONTRACT,
    operation: 'payout',
    args: [{
      type: 'ByteArray',
      value: pool_id
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 128
    }
    ]
  })
  return response
}

export async function test_payout(pool_id, neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invokeRead({
    scriptHash: BET_CONTRACT,
    operation: 'payout',
    args: [{
      type: 'ByteArray',
      value: pool_id
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 128
    }
    ]
  })
  if (response.state === 'FAULT') {
    return {
      'message': 'error',
      'data': response.exception.slice(35),
      'state': false
    }
  } else {
    return {
      'state': true
    }
  }
}

export async function list_pools_by_owner(neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invokeRead({
    scriptHash: BET_CONTRACT,
    operation: 'list_pools_by_owner',
    args: [{
      type: 'Address',
      value: result.address
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 1
    }
    ]
  })
  return response
}

export async function list_pools_by_player(neo3Dapi) {
  const result = await neo3Dapi.getAccount()
  const { scriptHash } = await neo3Dapi.AddressToScriptHash({ address: result.address })
  const response = await neo3Dapi.invokeRead({
    scriptHash: BET_CONTRACT,
    operation: 'list_pools_by_player',
    args: [{
      type: 'Address',
      value: result.address
    }
    ],
    fee: '0.00000001',
    broadcastOverride: false,
    signers: [{
      account: scriptHash,
      scopes: 1
    }
    ]
  })
  return response
}

export async function init_util(minutesUntilExpiry, symbol, neo3Dapi) {
  const currentDate = new Date()
  const timestamp = currentDate.getTime()
  const expiry = timestamp + minutesUntilExpiry * 1000 * 60
  const threshold = expiry - 1
  const url = `https://api.binance.com/api/v3/aggTrades?symbol=${symbol}&startTime=${expiry - 1000}&endTime=${expiry}`
  const filter = '$[-1:]..p'
  console.log(url)
  const response = await pool_init(1, url, filter, 100000000, expiry, threshold, 200000000, '33333.3', 'test', neo3Dapi)
  console.log(url)
  console.log(response)
}

export async function main() {
  try {
    const client = await connect()
    const runnable = await test_payout('0x4309b80d1c27f655425ce52676556a1b9862892d60ac814ae5a6a37c54b174ee', client)
    if (runnable) {
      const response = await payout('0x4309b80d1c27f655425ce52676556a1b9862892d60ac814ae5a6a37c54b174ee', client)
      console.log(response)
    }
  } catch ({ type, description, data }) {
    switch (type) {
      case 'NO_PROVIDER':
        alert('No provider available.')
        break
      case 'CONNECTION_DENIED':
        alert('The user rejected the request to connect with your dApp.')
        break
      case 'CANCELED':
        alert('You have canceled your bet.')
        break
      case 'RPC_ERROR':
        alert('RPC connection failed.')
        break
      case 'MALFORMED_INPUT':
        alert('Oops! There seems to be a problem with your input parameters.')
    }
  }
}

