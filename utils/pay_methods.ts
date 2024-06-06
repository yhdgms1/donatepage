enum PayType {
  DonationAlerts,
  TON,
}

type PayMethod =
  {
    type: PayType.DonationAlerts,
    /**
     * https://www.donationalerts.com/r/{handle}
     */
    handle: string;
  }
| 
  {
    type: PayType.TON,
    /**
     * ton://transfer/{address}
     */
    address: string;
  }

export { PayType }
export type { PayMethod }