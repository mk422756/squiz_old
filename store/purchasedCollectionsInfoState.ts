import {atom} from 'recoil'
import {PurchasedCollectionInfo} from 'models/purchasedCollectionInfo'

export const purchasedCollectionsInfoState = atom({
  key: 'purchasedCollectionsState',
  default: [] as PurchasedCollectionInfo[],
})
