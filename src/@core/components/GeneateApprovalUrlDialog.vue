<script setup>
import { useClipboard } from '@vueuse/core';
import { ref } from 'vue';

const props = defineProps({
  selectedSendTo: {
    required: true
  },

  sendTo: {
    required: true
  },
  generatedUrl: "",
  isGenerateLinkModal: false,
  submitLinkRequestForm: null,


});
const generatedUrl = props.generatedUrl;
const requestLinkFormRev = ref();
const { text, copy, copied, isSupported } = useClipboard({ generatedUrl })
</script>

<template>

  <VDialog height="auto"
    persistent
    v-model="props.isGenerateLinkModal" max-width="600">

    <DialogCloseBtn @click="closeLinkModal" />
 

    <VCard title="SEND FOR APPROVAL">

      <VDivider />

      <VCardText class="">

        <VForm ref="requestLinkFormRev"
          @submit.prevent="props.submitLinkRequestForm" >

          <VRow>

            <VCol cols="12"
              sm="4">
              <h4>Generate link for</h4>
            </VCol>

            <VCol cols="12"
              sm="8">
              <VSelect v-model="props.selectedSendTo"
                return-object
                :item-props="true"
                label="Select who approves"
                :items="props.sendTo"
                :rules="[requiredValidator]"
                item-title="first_name"
                item-value="id"
                clearable
                clear-icon="tabler-x" />
            </VCol>
          </VRow>

          <div class="d-flex justify-end mt-2">
            <div v-if="props.isgeneratingLink">
              <VProgressCircular indeterminate
                color="info" /> Generating....
            </div>
            <div v-else
              v-if="!props.generatedUrl">
              <!-- <VBtn variant="tonal"
                color="secondary"
                @click="isGenerateLinkModal = false"
                class="mx-1">
                Close
              </VBtn> -->
              <VBtn color="info"
                type="submit">

                <VIcon icon="tabler-link"></VIcon>
                Generate Link

              </VBtn>
            </div>
          </div>


        </VForm>






        <div class="mt-2"
          v-if="props.generatedUrl !== ''">
          <VCode v-model="props.generatedUrl"
            cols="3"
            rows="6">
            {{ props.generatedUrl }}


            <div class="d-flex justify-end gap-3 ">

              <VDivider height="2px"
                color="success"
                class="mt-4" />

              <div v-if="isSupported">
                <button @click="copy(props.generatedUrl)">
                  <!-- by default, `copied` will be reset in 1.5s -->
                  <!-- <span v-if="!copied">Copy</span> -->
                  <span v-if="copied">Copied!</span>
                  <VIcon v-if="!copied"
                    color="secondary"
                    size="35"
                    icon="tabler-copy">
                  </VIcon>
                </button>

              </div>


              <a target="_blank"
                :href='`mailto: ${props.selectedSendTo.email}?subject=${encodeURIComponent("Request Approval")}&body=${encodeURIComponent(props.generatedUrl)}`'>
                <VIcon color="warning"
                  size="35"
                  icon="tabler-mail">
                </VIcon>

              </a>

              <a target="_blank"
                :href="`https://wa.me/${getuserPhone(props.selectedSendTo)}?text=${encodeURIComponent(props.generatedUrl)}`">
                <VIcon color="success"
                  size="35"
                  icon="tabler-brand-whatsapp">
                </VIcon>
              </a>

              <a target="_blank"
                :href="`${props.generatedUrl}`">
                <VIcon color="info"
                  size="35"
                  icon="tabler-world">
                </VIcon>
              </a>

              <VIcon color="error"
                @click="props.generatedUrl = ''"
                size="35"
                icon="tabler-x">
              </VIcon>


            </div>
          </VCode>




        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>
