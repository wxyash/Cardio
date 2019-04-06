<template>
  <div class="container has-text-centered">
          <p class="is-size-1">Blackjack</p>
    <div class="columns">
      <div class="column is-two-thirds">
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
    <div class>
      <br>
      <p class="is-size-3">Dealer</p>
      <div class="columns">
        <div class="inline-block is-pulled-left">
          <div class="is-pulled-left ma-5" v-for="card in dealerCards" :key="card.code">
            <figure class="image">
              <img :src="card.image" alt="Placeholder image">
            </figure>
          </div>
        </div>
      </div>
      <p>Score: {{getTotalPoints(dealerCards)}}</p>
      <br><br>
      <p class="is-size-3">You</p>
      <div class="columns">
        <div class="inline-block is-pulled-left">
          <div class="is-pulled-left ma-5" v-for="card in playerCards" :key="card.code">
            <figure class="image">
              <img :src="card.image" alt="Placeholder image">
            </figure>
          </div>
        </div>
      </div>
      <p>Score: {{getTotalPoints(playerCards)}}</p>
      <div class="button is-primary is-large ma-5" @click="hit()">Hit</div>
      <div class="button is-danger is-large ma-5" @click="stick()">Stick</div>
    </div>
      </div>
      <div class="column has-background-grey-lighter is-rounded">
        <div class="card">
          <p class="is-size-4">LOG</p>
        </div>
        <p class="is-marginless is-paddingless" v-for="(item, index) in log" :key="index">{{item}}</p>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import { API } from '../global/API.js'
export default {
  async mounted () {
    this.isLoading = true
    await this.shuffle()
    await this.initGame()
    this.isLoading = false
  },
  data: function () {
    return {
      log: [],
      isFullPage: true,
      isLoading: true,
      playerCards: [],
      dealerCards: [],
      playerStick: false
    }
  },
  methods: {
    shuffle () {
      let self = this
      return API.shuffle()
        .then(res => {
          this.$root.deckID = res.data.deck_id
        })
        .catch(error => {
          console.log('Error', error.message)
        })
    },
    async hit () {
      this.log.push(`Player decides to hit, total ${this.getTotalPoints(this.playerCards)}`)
      await this.pick(this.playerCards)
      this.log.push(`Player decides to hit, total ${this.getTotalPoints(this.playerCards)}`)
      if (this.getTotalPoints(this.playerCards) >= 21) {
        this.stick()
      }
    },
    pick (owner) {
      return API.drawCard(this.$root.deckID)
        .then(res => {
          owner.push(res.data.cards[0])
        })
        .catch(err => {
          console.log('Error', err.message)
        })
    },
    getPoints (card) {
      let suites = ['KING', 'QUEEN', 'JACK']
      if (suites.includes(card.value)) {
        return 10
      }
      if (card.value === 'ACE') {
        return 1
      }
      return parseInt(card.value)
    },
    getTotalPoints (owner) {
      let total = 0
      for (let card of owner) {
        total += this.getPoints(card)
      }
      return total
    },
    async initGame () {
      this.log.push('New Game initiated.')
      let playerCardInit = []
      let dealerCardInit = []

      await this.pick(playerCardInit)
      await this.pick(dealerCardInit)
      console.log('items', dealerCardInit)
      for (const card of playerCardInit) {
        console.log('HERE I AM')
        if (this.getTotalPoints(playerCardInit) >= 21) {
          playerCardInit.pop()
          break
        }
        await this.pick(playerCardInit)
      }

      for (const card of dealerCardInit) {
        if (this.getTotalPoints(dealerCardInit) >= 21) {
          dealerCardInit.pop()
          break
        }
        await this.pick(dealerCardInit)
      }

      this.playerCards = playerCardInit
      this.dealerCards = dealerCardInit
    },
    async stick () {
      this.playerStick = true
      await this.pick(this.dealerCards)
      this.log.push(`Dealer hits , total ${this.getTotalPoints(this.dealerCards)}`)
    },
    async reset () {
      this.log = []
      this.isLoading = true
      this.isFullPage = true
      this.isLoading = true
      this.playerCards = []
      this.dealerCards = []
      this.isLoading = false
      this.initGame()
    },
    displayWinAlert () {
      this.log.push(`Player WINS!!!`)
      this.$dialog.alert({
        title: 'Congratulations!!',
        message: 'You won!!',
        type: 'is-success'
      })
    },
    displayLostAlert () {
      this.log.push(`House WINS!!!`)
      this.$dialog.alert({
        title: 'You Lost',
        message: 'Sorry you lost, the house has won.',
        type: 'is-danger'
      })
    }
  },
  computed: {
  },
  watch: {
    'playerCards': function () {
      let pTotal = this.getTotalPoints(this.playerCards)
      let dTotal = this.getTotalPoints(this.dealerCards)
      if (pTotal > 21 || (pTotal < dTotal && this.playerStick)) {
        this.displayLostAlert()
        this.reset()
      }
    },
    'dealerCards': function () {
      let pTotal = this.getTotalPoints(this.playerCards)
      let dTotal = this.getTotalPoints(this.dealerCards)
      if (dTotal > 21 || (this.playerStick && dTotal < pTotal)) {
        this.displayWinAlert()
        this.reset()
      }
    }
  }
}
</script>
<style scoped>
.button:hover {
  transition: all 0.3s;
}

.deck-card {
  max-width: 250px;
  height: auto;
}
.image {
  max-width: 125px;
  height: auto;
}

.ma-5 {
  margin: 5px;
}

.center {
  align-items: center;
  justify-content: center;
}
</style>
