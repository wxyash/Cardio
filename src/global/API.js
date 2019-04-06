import axios from 'axios'

export const API = {
  shuffle: function () {
    return axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
  },
  drawCard: function (deckID) {
    return axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
  }
}
