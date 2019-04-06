<template>
<div class="container-fluid has-text-centered" >
  <div class="v-centerd" >
    <p class="is-size-2">Welcome to Card-io</p>
      <a class="button is-primary is-outlined" @click="$router.push({name: 'play'})">Play Now</a>
  </div>
</div>
</template>
<script>
export default {}
</script>
<style scoped>
.v-centerd {
  margin-top:35vh;
}

.button:hover {
  transition: all 0.3s;
}

</style>
