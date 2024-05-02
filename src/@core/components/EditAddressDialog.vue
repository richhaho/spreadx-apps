<script setup>
const props = defineProps({
  billingAddress: {
    type: Object,
    required: true,
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  }
})


const emit = defineEmits([
  'update:isDialogVisible',
  'submit',
])

const billingAddress = ref(structuredClone(toRaw(props.billingAddress)))

const resetForm = () => {
  emit('update:isDialogVisible', false)
  billingAddress.value = structuredClone(toRaw(props.billingAddress))
}

const onFormSubmit = (data) => {
  emit('update:isDialogVisible', false)
  emit('submit', billingAddress.value)
  emit('update:billingAddress',  billingAddress.value)
}

const dialogModelValueUpdate = val => {
  emit('update:isDialogVisible', val)
}
</script>
<script>
export default {
  name: "App",
  data() {
   return {
    mapCenter: { lat: 6.465422, lng: 3.406448 }, // Initial center
    mapZoom: 7, // Initial zoom level
    markerPosition: null, // Marker position will be set based on searched location
    
   };
  },
  methods: {
   setPlace(places) {
    // console.log(places)
    this.markerPosition = {
     lat: places.geometry.location.lat(),
     lng: places.geometry.location.lng(),
    };
    this.mapCenter = {
     lat: places.geometry.location.lat(),
     lng: places.geometry.location.lng(),
    //  mapZoom:15
    };
    this.mapZoom = 15
  },
 geolocate: function () {
    navigator.geolocation.getCurrentPosition((position) => {
     this.mapCenter = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
     };
     this.markerPosition = {
       lat: position.coords.latitude,
       lng: position.coords.longitude,
     };
    });
   },
  },
  mounted() {
   this.geolocate();
   this.mapZoom = 16
  }
 };
 
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
    class="maps"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard
      v-if="props.billingAddress"
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 text-center mb-3">
          Delivery Address
        </VCardTitle>
      </VCardItem>
      <VCardText>
        <div class="map">
          <GMapAutocomplete
            placeholder="This is a placeholder"
            @place_changed="setPlace"
            style="font-size: large"
          >
          </GMapAutocomplete>
          <GMapMap
            :center="mapCenter"
            :zoom="mapZoom"
            style="width: 100%; height: 250px"
          >
          <GMapMarker :position="markerPosition" @click="zoom"/>
          </GMapMap>
          <v-btn
           text="locate me"
           @click="geolocate"
          ></v-btn>
        </div>
        <VForm @submit.prevent="onFormSubmit">
          <VRow>
            <VCol
              cols="6"
              md="6"
            >
              <VTextField
                v-model="billingAddress.first_name"
                label="First Name"
              />
            </VCol>
            <VCol
              cols="6"
              md="6"
            >
              <VTextField
                v-model="billingAddress.last_name"
                label="Last Name"
              />
            </VCol>

            <VCol
              cols="6"
              md="6"
            >
              <VTextField
                v-model="billingAddress.city"
                label="City"
              />
            </VCol>
            <VCol
              cols="6"
              md="6"
            >
              <VTextField
                v-model="billingAddress.state"
                label="State"
              />
            </VCol>

            <!-- 👉 VAT Number -->
            <VCol
              cols="12"
              md="12"
            >
              <VTextField
                v-model="billingAddress.phone"
                label="Phone Number"
              />
            </VCol>

            <VCol
              cols="6"
              md="6"
            >
              <VTextField
                v-model="billingAddress.address1"
                label="Address 1"
              />
            </VCol>
            <VCol
              cols="6"
              md="6"
            >
              <VTextField
                v-model="billingAddress.address2"
                label="Address 2"
              />
            </VCol>
.
            <VCol
              cols="12"
              md="12"
            >
              <VSelect
                v-model="billingAddress.country"
                label="Country"
                :items="['UAE', 'USA', 'Uk', 'France', 'Germany', 'Japan']"
              />
            </VCol>

            <VCol
              cols="12"
              md="12"
            >
              <VTextField
                v-model="billingAddress.email"
                label="Email"
              />
            </VCol>

            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                type="submit"
                class="me-3"
              >
                submit
              </VBtn>

              <VBtn
                variant="tonal"
                color="secondary"
                @click="resetForm"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
<style lang="scss">
.map{
  margin-bottom:15px;
}
.map div{
 border-radius:7px; 
 margin-bottom:5px;
}
.map input{
  margin-bottom:15px;
  outline:none;
  border:1px solid black;
  width:100%;
  height:40px;
  border-radius:6px;
  padding-left:5px;
}
.map input:hover{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  outline:none;
  border:1px solid black;
}
.pac-container{
  z-index:2401;
}
</style>