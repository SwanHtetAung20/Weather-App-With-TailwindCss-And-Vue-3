<template>
  <main class="container text-white">
    <div class="pt-4 mt-8 relative">
      <input
        v-model="searchQuery"
        @input="getSearchResults"
        type="text"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-md"
      />
      <ul
        v-show="mapBoxSearchResults"
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
      >
        <p v-if="searchError">Sorry, Something went wrong please try again!!</p>
        <p v-if="!searchError && mapBoxSearchResults.length === 0">
          No Result match your place, please try a different places
        </p>
        <template v-else>
          <li
            v-for="searchValue in mapBoxSearchResults"
            :key="searchValue.id"
            class="py-2 cursor-pointer"
            @click="previewCity(searchValue)"
          >
            {{ searchValue.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />

        <template #fallback>
          <CityCardSkeleton />
          <!-- <PulseLoader /> -->
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import CityList from "@/components/CityList.vue";
import CityCardSkeleton from "@/components/CityCardSkeleton.vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

const searchQuery = ref("");
const queryTimeOut = ref("");
const mapboxAPIKey = "use your own mapbox api key"; // https://docs.mapbox.com/api/overview/
const mapBoxSearchResults = ref("");
const searchError = ref("");
const router = useRouter();

const getSearchResults = () => {
  clearTimeout(queryTimeOut.value);
  queryTimeOut.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const res = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`
        );
        mapBoxSearchResults.value = res.data.features;
      } catch {
        searchError.value = true;
      }
      return;
    }

    mapBoxSearchResults = null;
  }, 300);
};

const previewCity = (searchValue) => {
  console.log(searchValue);
  const [city, state] = searchValue.place_name.split(",");
  console.log(city, state);
  router.push({
    path: `/weather/${state.trim().replaceAll("", "")}/${city.trim()}`,
    query: {
      lat: searchValue.geometry.coordinates[1],
      lng: searchValue.geometry.coordinates[0],
      preview: true,
    },
  });
};
</script>
