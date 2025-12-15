/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solmarket.json`.
 */
export type Solmarket = {
  address: 'Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe'
  metadata: {
    name: 'solmarket'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'close'
      discriminator: [98, 165, 201, 177, 108, 65, 206, 96]
      accounts: [
        {
          name: 'payer'
          writable: true
          signer: true
        },
        {
          name: 'solmarket'
          writable: true
        },
      ]
      args: []
    },
    {
      name: 'decrement'
      discriminator: [106, 227, 168, 59, 248, 27, 150, 101]
      accounts: [
        {
          name: 'solmarket'
          writable: true
        },
      ]
      args: []
    },
    {
      name: 'increment'
      discriminator: [11, 18, 104, 9, 104, 174, 59, 33]
      accounts: [
        {
          name: 'solmarket'
          writable: true
        },
      ]
      args: []
    },
    {
      name: 'initialize'
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
      accounts: [
        {
          name: 'payer'
          writable: true
          signer: true
        },
        {
          name: 'solmarket'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'set'
      discriminator: [198, 51, 53, 241, 116, 29, 126, 194]
      accounts: [
        {
          name: 'solmarket'
          writable: true
        },
      ]
      args: [
        {
          name: 'value'
          type: 'u8'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'solmarket'
      discriminator: [255, 176, 4, 245, 188, 253, 124, 25]
    },
  ]
  types: [
    {
      name: 'solmarket'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'count'
            type: 'u8'
          },
        ]
      }
    },
  ]
}
