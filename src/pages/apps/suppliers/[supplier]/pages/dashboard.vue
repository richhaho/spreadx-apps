<script setup>

</script>
<style>
.header {
  padding: 20px;
  text-align: center;
}

.welcome-container {
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 10%);
  margin-block: 40px;
  margin-inline: auto;
  max-inline-size: 800px;
}
</style>
<template>
  <div>
    <div class="header">
        <h1>Welcome to {{ currentSupplier }}</h1>
      </div>

      <div class="welcome-container">
        <p>
          From your account dashboard. you can easily check & view your recent orders and create new one.
        </p>
      </div>
  </div>
</template>
