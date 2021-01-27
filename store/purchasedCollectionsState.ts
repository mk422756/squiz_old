import {atom} from 'recoil'
import {PurchasedCollectionInfo} from 'models/purchasedCollectionInfo'

export const purchasedCollectionsState = atom({
  key: 'purchasedCollectionsState',
  default: [] as PurchasedCollectionInfo[],
})
