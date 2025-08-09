import { createSlice } from '@reduxjs/toolkit'


const storedAgents = JSON.parse(localStorage.getItem('agents')) || [];
const matched = storedAgents.filter((item) => item.customerName === 'VT');
const highestSeer = matched.length > 0
  ? matched.reduce((maxItem, currentItem) => {
    return Number(currentItem.commision) > Number(maxItem.commision) ? currentItem : maxItem;
  })
  : null;
export const mastercommon = createSlice({
  name: "mastercommonrecord",
  initialState: {
    mastercommonrec: highestSeer ? highestSeer : ''
  },
  reducers: {
    setfinalmasterrecord: (state, action) => {
      state.mastercommonrec = action.payload
    }
  }
})

export const { setfinalmasterrecord } = mastercommon.actions

export default mastercommon.reducer