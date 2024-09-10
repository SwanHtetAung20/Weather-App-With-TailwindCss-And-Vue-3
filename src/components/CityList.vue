<template>
  <div v-for="city in savedCities" :key="city.id">
    <CityCard :city="city" @click="goToCityView(city)" />
  </div>
  <div v-if="savedCities.length === 0">
    <p>
      No Location added. To start tracking locations,search in the field above.
      <span
        >I did this by watching
        <strong
          class="text-gray-800 text-2xl cursor-pointer"
          @click="goToMainChannel"
          >Net Ninja's</strong
        >YouTube videos</span
      >
    </p>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import CityCard from "./CityCard.vue";
import { useRouter } from "vue-router";

const savedCities = ref([]);
const router = useRouter();

const getCities = async () => {
  if (localStorage.getItem("savedCitites")) {
    savedCities.value = JSON.parse(localStorage.getItem("savedCities"));
  }

  const requests = [];
  const appid = "use your owm appid"; // https://openweathermap.org/

  savedCities.value.forEach((city) => {
    requests.push(
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=${appid}&units=imperial`
      )
    );
  });
  const weatherData = await Promise.all(requests);

  await new Promise((res) => setTimeout(res, 1000));

  weatherData.forEach((value, index) => {
    savedCities.value[index].weather = value.data;
  });
};

await getCities();

const goToCityView = (city) => {
  router.push({
    path: `/weather/${city.state}/${city.city}`,
    query: { id: city.id, lat: city.coords.lat, lng: city.coords.lng },
  });
};

const goToMainChannel = () => {
  window.open(
    "https://www.youtube.com/watch?v=gUsBaB5ViAo&list=PL4cUxeGkcC9hfoy8vFQ5tbXO3vY0xhhUZ&index=1"
  );
};
</script>
